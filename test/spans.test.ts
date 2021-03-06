import { NodeTracerProvider } from '@opentelemetry/node';
import { Spans } from '../src/trace/spans';

import * as assert from 'assert';

describe('spans', () => {
  it('wraps the span', () => {
    let provider = new NodeTracerProvider();
    const span = provider.getTracer('default').startSpan('my-span');
    let spans: Spans = new Spans(span);
    assert.ok(span.isRecording());
    spans.ok();
    assert.ok(!span.isRecording());
  });
  it('produces a span', () => {
    let provider = new NodeTracerProvider();
    let span = Spans.startSpan(provider.getTracer('default'), 'my-span');
    assert.ok(span.current().isRecording());
    span.ok();
    assert.ok(!span.current().isRecording());
  });
  it('throws the error', () => {
    let provider = new NodeTracerProvider();
    const span = provider.getTracer('default').startSpan('error-span');
    let spans: Spans = new Spans(span);
    assert.ok(span.isRecording());
    const t = () => {
      spans.doError('this is an error message');
    };
    expect(t).toThrow(Error);
    assert.ok(!span.isRecording());
  });
  it('throws the reference error', () => {
    let provider = new NodeTracerProvider();
    const span = provider.getTracer('default').startSpan('error-span');
    let spans: Spans = new Spans(span);
    assert.ok(span.isRecording());
    const t = () => {
      spans.doError('this is an error message', ReferenceError);
    };
    expect(t).toThrow(ReferenceError);
    assert.ok(!span.isRecording());
  });
  it('return the reference error', () => {
    let provider = new NodeTracerProvider();
    const span = provider.getTracer('default').startSpan('error-span');
    let spans: Spans = new Spans(span);
    assert.ok(span.isRecording());
    const err = spans.toError('this is an error message', ReferenceError);
    expect(err).toStrictEqual(ReferenceError('this is an error message'));
    assert.ok(!span.isRecording());
  });
});
