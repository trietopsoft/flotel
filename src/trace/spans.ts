import {
  Span,
  Exception,
  TimeInput,
  SpanAttributeValue,
  SpanAttributes,
  SpanStatusCode,
  Tracer,
  SpanOptions,
  Context,
} from '@opentelemetry/api';

/**
 * Fluent wrapper for OpenTelemetry Span, includes convenience methods for
 * ending the span with associated status (OK, ERROR).
 */
export class Spans {
  /**
   * Wrap the span, static accessor.
   *
   * @param _span the original span
   * @returns the fluent wrapper
   */
  static wrap(_span: Span): Spans {
    return new Spans(_span);
  }

  /**
   * Start the span with the associated Tracer.
   *
   * @param _tracer the tracer to use for the span.
   * @param _name the span name, required.
   * @param _opts optional span options.
   * @param _ctx optional source telemetry context.
   * @returns
   */
  static startSpan(
    _tracer: Tracer,
    _name: string,
    _opts?: SpanOptions,
    _ctx?: Context
  ): Spans {
    let span = _tracer.startSpan(_name, _opts, _ctx);
    return new Spans(span);
  }

  /**
   * Wrap the span.
   *
   * @param _span the original span
   */
  constructor(private _span: Span) {}

  /**
   * Get the original span.
   *
   * @returns the original span
   */
  current(): Span {
    return this._span;
  }

  /**
   * Sets an attribute to the span.
   *
   * Sets a single Attribute with the key and value passed as arguments.
   *
   * @param key the key for this attribute.
   * @param value the value for this attribute. Setting a value null or
   *              undefined is invalid and will result in undefined behavior.
   */
  setAttribute(key: string, value: SpanAttributeValue): this {
    this._span.setAttribute(key, value);
    return this;
  }

  /**
   * Sets attributes to the span.
   *
   * @param attributes the attributes that will be added.
   *                   null or undefined attribute values
   *                   are invalid and will result in undefined behavior.
   */
  setAttributes(attributes: SpanAttributes): this {
    this._span.setAttributes(attributes);
    return this;
  }

  /**
   * Adds an event to the Span.
   *
   * @param name the name of the event.
   * @param [attributesOrStartTime] the attributes that will be added; these are
   *     associated with this event. Can be also a start time
   *     if type is {@type TimeInput} and 3rd param is undefined
   * @param [startTime] start time of the event.
   */
  addEvent(
    name: string,
    attributesOrStartTime?: SpanAttributes | TimeInput,
    startTime?: TimeInput
  ): this {
    this._span.addEvent(name, attributesOrStartTime, startTime);
    return this;
  }

  /**
   * Sets exception as a span event
   * @param exception the exception the only accepted values are string or Error
   * @param [time] the time to set as Span's event time. If not provided,
   *     use the current time.
   */
  recordException(exception: Exception, time?: TimeInput): void {
    this._span.recordException(exception, time);
  }

  /**
   * Set the OK status for the span with an optional end and time parameter.
   * Message will be set on the span status.
   *
   * @param end if true (default), ends the span.
   * @param _message optional status message.
   * @param _time optional end time.
   * @returns the fluent wrapper
   */
  ok(end: boolean = true, _message?: string, _time?: TimeInput): this {
    this._span.setStatus({ code: SpanStatusCode.OK, message: _message });
    this.end(end, _time);
    return this;
  }

  /**
   * Set the ERROR status for the span with an optional end and time parameter.
   * Message will be set on the span status but no error will be thrown.
   *
   * @param _message optional error message.
   * @param end if true (default), ends the span.
   * @param _time optional end time.
   * @returns the fluent wrapper
   */
  error(_message?: string, end: boolean = true, _time?: TimeInput): this {
    this._span.setStatus({ code: SpanStatusCode.ERROR, message: _message });
    this.end(end, _time);
    return this;
  }

  /**
   * Set the ERROR status for the span with an optional end and time parameter.
   * Message will be used with the associated errorType to raise an exception.
   * This method does not return normally.
   *
   * @param _message error message, required.
   * @param errorType type of exception, default is Error.
   * @param end if true (default), ends the span.
   * @param _time optional end time.
   */
  doError(
    _message: string,
    errorType: any = Error,
    end: boolean = true,
    _time?: TimeInput
  ): void {
    this._span.setStatus({ code: SpanStatusCode.ERROR, message: _message });
    this.end(end, _time);
    throw errorType(_message);
  }

  /**
   * Set the ERROR status for the span with an optional end and time parameter.
   * Message will be used with the associated errorType to raise an exception.
   * This method returns the constructed error.
   *
   * @param _message error message, required.
   * @param errorType type of exception, default is Error.
   * @param end if true (default), ends the span.
   * @param _time optional end time.
   * @return the error object
   */
  toError(
    _message: string,
    errorType: any = Error,
    end: boolean = true,
    _time?: TimeInput
  ): any {
    this._span.setStatus({ code: SpanStatusCode.ERROR, message: _message });
    this.end(end, _time);
    return errorType(_message);
  }

  /**
   * Set the ERROR status for the span with an optional end and time parameter.
   * The exception will not be thrown once the span status has been set.
   * The exception will be recorded in the span if provided.
   *
   * @param _exception optional associated exception.
   * @param end if true (default), ends the span.
   * @param _time optional end time.
   * @returns the fluent wrapper
   */
  exception(
    _exception?: Exception,
    end: boolean = true,
    _time?: TimeInput
  ): this {
    if (_exception) {
      this._span.recordException(_exception, _time);
    }
    this._span.setStatus({ code: SpanStatusCode.ERROR });
    this.end(end, _time);
    return this;
  }

  /**
   * Set the ERROR status for the span with an optional end and time parameter.
   * The exception WILL be thrown once the span status has been set.
   * The exception will be recorded in the span.
   * This method does not return normally.
   *
   * @param _exception associated exception.
   * @param end if true (default), ends the span.
   * @param _time optional end time.
   */
  doThrow(_exception: Exception, end: boolean = true, _time?: TimeInput): void {
    this._span.recordException(_exception, _time);
    this._span.setStatus({ code: SpanStatusCode.ERROR });
    this.end(end, _time);
    throw _exception;
  }

  /**
   * Set the ERROR status for the span with an optional end and time parameter.
   * The exception will be recorded in the span.
   * This method returns the original exception.
   *
   * @param _exception associated exception.
   * @param end if true (default), ends the span.
   * @param _time optional end time.
   */
  toThrow(_exception: Exception, end: boolean = true, _time?: TimeInput): any {
    this._span.recordException(_exception, _time);
    this._span.setStatus({ code: SpanStatusCode.ERROR });
    this.end(end, _time);
    return _exception;
  }

  /**
   * End the span with optional time input.
   *
   * @param _autoEnd optional flag to end the span, redundant for fluent access.
   * @param _time optional end time.
   * @returns the fluent wrapper
   */
  end(_autoEnd: boolean = true, _time?: TimeInput): this {
    if (_autoEnd) {
      this._span.end(_time);
    }
    return this;
  }
}
