import {isDate} from 'node:util/types';
import {DateTime, DateTimeMaybeValid, Interval} from 'luxon';
import {z} from 'zod';

import {parameterize} from '../lib/parameterize';

import {ERRORS} from '../util/errors';

import {STRINGS} from '../config';

import {ExecutePlugin, PluginParams} from '../types/interface';
import {
  PaddingReceipt,
  TimeNormalizerConfig,
  TimeParams,
} from '../types/time-sync';
import {validate} from '../util/validations';

const {InputValidationError} = ERRORS;

const {
  INVALID_TIME_NORMALIZATION,
  INVALID_OBSERVATION_OVERLAP,
  AVOIDING_PADDING_BY_EDGES,
} = STRINGS;

export const TimeSync = (globalConfig: TimeNormalizerConfig): ExecutePlugin => {
  const metadata = {
    kind: 'execute',
  };

  /**
   * Take input array and return time-synchronized input array.
   */
  const execute = (inputs: PluginParams[]): PluginParams[] => {
    const validatedConfig = validateGlobalConfig();
    const timeParams = {
      startTime: DateTime.fromISO(validatedConfig['start-time']),
      endTime: DateTime.fromISO(validatedConfig['end-time']),
      interval: validatedConfig.interval,
      allowPadding: validatedConfig['allow-padding'],
    };

    const pad = checkForPadding(inputs, timeParams);
    validatePadding(pad, timeParams);

    const paddedInputs = padInputs(inputs, pad, timeParams);

    const flattenInputs = paddedInputs.reduce(
      (acc: PluginParams[], input, index) => {
        const safeInput = Object.assign({}, input, validateInput(input, index));
        const currentMoment = parseDate(safeInput.timestamp);

        /** Checks if not the first input, then check consistency with previous ones. */
        if (index > 0) {
          const previousInput = paddedInputs[index - 1];
          const previousInputTimestamp = parseDate(previousInput.timestamp);

          /** Checks for timestamps overlap. */
          if (
            parseDate(previousInput.timestamp).plus({
              seconds: previousInput.duration,
            }) > currentMoment
          ) {
            throw new InputValidationError(INVALID_OBSERVATION_OVERLAP);
          }

          const compareableTime = previousInputTimestamp.plus({
            seconds: previousInput.duration,
          });

          const timelineGapSize = currentMoment
            .diff(compareableTime)
            .as('seconds');

          /** Checks if there is gap in timeline. */
          if (timelineGapSize > 1) {
            acc.push(
              ...getZeroishInputPerSecondBetweenRange(
                compareableTime,
                currentMoment,
                safeInput
              )
            );
          }
        }
        /** Break down current observation. */
        for (let i = 0; i < safeInput.duration; i++) {
          const normalizedInput = breakDownInput(safeInput, i);

          acc.push(normalizedInput);
        }

        return trimInputsByGlobalTimeline(acc, timeParams);
      },
      [] as PluginParams[]
    );

    const sortedInputs = flattenInputs.sort((a, b) =>
      parseDate(a.timestamp).diff(parseDate(b.timestamp)).as('seconds')
    );

    return resampleInputs(sortedInputs, timeParams) as PluginParams[];
  };

  const parseDate = (date: Date | string) => {
    if (!date) return DateTime.invalid('Invalid date');
    // dates are passed to time-sync.ts both in ISO 8601 format
    // and as a Date object (from the deserialization of a YAML file)
    // if the YAML parser fails to identify as a date, it passes as a string
    if (isDate(date)) {
      return DateTime.fromJSDate(date);
    }
    if (typeof date === 'string') {
      return DateTime.fromISO(date);
    }
    throw new InputValidationError(
      `Unexpected date datatype: ${typeof date}: ${date}`
    );
  };

  /**
   * Validates input parameters.
   */
  const validateInput = (input: PluginParams, index: number) => {
    const schema = z.object({
      timestamp: z
        .string({
          required_error: `required in input[${index}]`,
        })
        .datetime({
          message: `invalid datetime in input[${index}]`,
        })
        .or(z.date()),
      duration: z.number(),
    });

    return validate<z.infer<typeof schema>>(schema, input);
  };

  /**
   * Validates global config parameters.
   */
  const validateGlobalConfig = () => {
    if (globalConfig === undefined) {
      throw new InputValidationError(INVALID_TIME_NORMALIZATION);
    }

    const schema = z
      .object({
        'start-time': z.string().datetime(),
        'end-time': z.string().datetime(),
        interval: z.number(),
        'allow-padding': z.boolean(),
      })
      .refine(data => data['start-time'] < data['end-time'], {
        message: '`start-time` should be lower than `end-time`',
      });

    return validate<z.infer<typeof schema>>(schema, globalConfig);
  };

  /**
   * Calculates minimal factor.
   */
  const convertPerInterval = (value: number, duration: number) =>
    value / duration;

  /**
   * Normalize time per given second.
   */
  const normalizeTimePerSecond = (
    currentRoundMoment: Date | string,
    i: number
  ) => {
    const thisMoment = parseDate(currentRoundMoment).startOf('second');
    return thisMoment.plus({seconds: i});
  };
  /**
   * Breaks down input per minimal time unit.
   */
  const breakDownInput = (input: PluginParams, i: number) => {
    const inputKeys = Object.keys(input);

    return inputKeys.reduce((acc, key) => {
      const method = parameterize.getAggregationMethod(key);

      if (key === 'timestamp') {
        const perSecond = normalizeTimePerSecond(input.timestamp, i);
        acc[key] = perSecond.toUTC().toISO() ?? '';

        return acc;
      }

      /** @todo use user defined resolution later */
      if (key === 'duration') {
        acc[key] = 1;

        return acc;
      }

      acc[key] =
        method === 'sum'
          ? convertPerInterval(input[key], input['duration'])
          : input[key];

      return acc;
    }, {} as PluginParams);
  };

  /**
   * Populates object to fill the gaps in observational timeline using zeroish values.
   */
  const fillWithZeroishInput = (
    input: PluginParams,
    missingTimestamp: DateTimeMaybeValid
  ) => {
    const metrics = Object.keys(input);

    return metrics.reduce((acc, metric) => {
      if (metric === 'timestamp') {
        acc[metric] = missingTimestamp.startOf('second').toUTC().toISO() ?? '';

        return acc;
      }

      /** @todo later will be changed to user defined interval */
      if (metric === 'duration') {
        acc[metric] = 1;

        return acc;
      }

      if (metric === 'time-reserved') {
        acc[metric] = acc['duration'];

        return acc;
      }

      const method = parameterize.getAggregationMethod(metric);

      if (method === 'avg' || method === 'sum') {
        acc[metric] = 0;

        return acc;
      }

      acc[metric] = input[metric];

      return acc;
    }, {} as PluginParams);
  };

  /**
   * Checks if `error on padding` is enabled and padding is needed. If so, then throws error.
   */
  const validatePadding = (pad: PaddingReceipt, params: TimeParams): void => {
    const {start, end} = pad;
    const isPaddingNeeded = start || end;
    if (!params.allowPadding && isPaddingNeeded) {
      throw new InputValidationError(AVOIDING_PADDING_BY_EDGES(start, end));
    }
  };

  /**
   * Checks if padding is needed either at start of the timeline or the end and returns status.
   */
  const checkForPadding = (
    inputs: PluginParams[],
    params: TimeParams
  ): PaddingReceipt => {
    const startDiffInSeconds = parseDate(inputs[0].timestamp)
      .diff(params.startTime)
      .as('seconds');

    const lastInput = inputs[inputs.length - 1];

    const endDiffInSeconds = parseDate(lastInput.timestamp)
      .plus({second: lastInput.duration})
      .diff(params.endTime)
      .as('seconds');

    return {
      start: startDiffInSeconds > 0,
      end: endDiffInSeconds < 0,
    };
  };

  /**
   * Iterates over given inputs frame, meanwhile checking if aggregation method is `sum`, then calculates it.
   * For methods is `avg` and `none` calculating average of the frame.
   */
  const resampleInputFrame = (inputsInTimeslot: PluginParams[]) => {
    return inputsInTimeslot.reduce((acc, input, index, inputs) => {
      const metrics = Object.keys(input);

      metrics.forEach(metric => {
        const method = parameterize.getAggregationMethod(metric);
        acc[metric] = acc[metric] ?? 0;

        if (metric === 'timestamp') {
          acc[metric] = inputs[0][metric];

          return;
        }

        if (method === 'sum') {
          acc[metric] += input[metric];

          return;
        }

        if (method === 'none') {
          acc[metric] = input[metric];

          return;
        }

        /**
         * If timeslot contains records more than one, then divide each metric by the timeslot length,
         *  so that their sum yields the timeslot average.
         */
        if (
          inputsInTimeslot.length > 1 &&
          index === inputsInTimeslot.length - 1
        ) {
          acc[metric] /= inputsInTimeslot.length;

          return;
        }

        acc[metric] += input[metric];
      });

      return acc;
    }, {} as PluginParams);
  };

  /**
   * Takes each array frame with interval length, then aggregating them together as from units.yaml file.
   */
  const resampleInputs = (inputs: PluginParams[], params: TimeParams) => {
    return inputs.reduce((acc: PluginParams[], _input, index, inputs) => {
      const frameStart = index * params.interval;
      const frameEnd = (index + 1) * params.interval;
      const inputsFrame = inputs.slice(frameStart, frameEnd);

      const resampledInput = resampleInputFrame(inputsFrame);

      /** Checks if resampled input is not empty, then includes in result. */
      if (Object.keys(resampledInput).length > 0) {
        acc.push(resampledInput);
      }

      return acc;
    }, [] as PluginParams[]);
  };

  /**
   * Pads zeroish inputs from the beginning or at the end of the inputs if needed.
   */
  const padInputs = (
    inputs: PluginParams[],
    pad: PaddingReceipt,
    params: TimeParams
  ): PluginParams[] => {
    const {start, end} = pad;
    const paddedFromBeginning = [];

    if (start) {
      paddedFromBeginning.push(
        ...getZeroishInputPerSecondBetweenRange(
          params.startTime,
          parseDate(inputs[0].timestamp),
          inputs[0]
        )
      );
    }

    const paddedArray = paddedFromBeginning.concat(inputs);

    if (end) {
      const lastInput = inputs[inputs.length - 1];
      const lastInputEnd = parseDate(lastInput.timestamp).plus({
        seconds: lastInput.duration,
      });
      paddedArray.push(
        ...getZeroishInputPerSecondBetweenRange(
          lastInputEnd,
          params.endTime.plus({seconds: 1}),
          lastInput
        )
      );
    }
    return paddedArray;
  };

  const getZeroishInputPerSecondBetweenRange = (
    startDate: DateTimeMaybeValid,
    endDate: DateTimeMaybeValid,
    templateInput: PluginParams
  ) => {
    const array: PluginParams[] = [];
    const dateRange = Interval.fromDateTimes(startDate, endDate);
    for (const interval of dateRange.splitBy({second: 1})) {
      array.push(
        fillWithZeroishInput(
          templateInput,
          // as far as I can tell, start will never be null
          // because if we pass an invalid start/endDate to
          // Interval, we get a zero length array as the range
          interval.start || DateTime.invalid('not expected - start is null')
        )
      );
    }
    return array;
  };

  /*
   * Checks if input's timestamp is included in global specified period then leaves it, otherwise.
   */
  const trimInputsByGlobalTimeline = (
    inputs: PluginParams[],
    params: TimeParams
  ): PluginParams[] => {
    return inputs.reduce((acc: PluginParams[], item) => {
      const {timestamp} = item;

      if (
        parseDate(timestamp) >= params.startTime &&
        parseDate(timestamp) <= params.endTime
      ) {
        acc.push(item);
      }

      return acc;
    }, [] as PluginParams[]);
  };

  return {metadata, execute};
};
