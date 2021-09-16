import {
  Span,
  Exception,
  TimeInput,
  SpanAttributeValue,
  SpanAttributes,
  SpanStatusCode,
} from '@opentelemetry/api';

/**
 * 
 */
export class Spans {

  /**
   * 
   * @param _span 
   * @returns 
   */
  static wrap(_span: Span) : Spans {
    return new Spans(_span);
  }

  /**
   * 
   * @param _span 
   */
  constructor(private _span: Span) {}

  /**
   * 
   * @returns 
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
   * 
   * @param end 
   * @param _message 
   * @param _time 
   * @returns 
   */
  ok(end: boolean = true, _message?: string, _time?: TimeInput): this {
    this._span.setStatus({ code: SpanStatusCode.OK, message: _message });
    this.end(end, _time);
    return this;
  }

  /**
   * 
   * @param _message 
   * @param end 
   * @param _time 
   * @returns 
   */
  error(_message?: string, end: boolean = true, _time?: TimeInput): this {
    this._span.setStatus({ code: SpanStatusCode.ERROR, message: _message });
    this.end(end, _time);
    return this;
  }

  /**
   * 
   * @param _message 
   * @param errorType 
   * @param end 
   * @param _time 
   */
  doError(
    _message?: string,
    errorType: any = Error,
    end: boolean = true,
    _time?: TimeInput
  ): void {
    this._span.setStatus({ code: SpanStatusCode.ERROR, message: _message });
    this.end(end, _time);
    throw errorType(_message);
  }

  /**
   * 
   * @param _exception 
   * @param end 
   * @param _time 
   * @returns 
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
   * 
   * @param _exception 
   * @param end 
   * @param _time 
   */
  doThrow(_exception: Exception, end: boolean = true, _time?: TimeInput): void {
    this._span.recordException(_exception, _time);
    this._span.setStatus({ code: SpanStatusCode.ERROR });
    this.end(end, _time);
    throw _exception;
  }

  /**
   * 
   * @param _autoEnd 
   * @param _time 
   * @returns 
   */
  end(_autoEnd: boolean = true, _time?: TimeInput): this {
    if (_autoEnd) {
      this._span.end(_time);
    }
    return this;
  }
}
