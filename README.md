# Fluent OpenTelemetry JavaScript Wrapper

Provides a thin wrapper around the OpenTelemetry API components.  Aims to reduce the boilerplate code required to [manually instrument](https://opentelemetry.io/docs/js/instrumentation/) the span.

## Example Usage

Simple method with OK status:

```javascript
{
  let span = Spans.startSpan(tracer, 'simple');
  // do stuff
  span.ok();
}
```

Simple method with ERROR status that ends the span but no other side-effect:

```javascript
{
  let span = Spans.startSpan(tracer, 'trap-and-record');
  try {
    // do stuff
    span.ok();
  } catch (e) {
    // Record the error to the span
    span.error('something bad happened');
  }
}
```

Re-throw the caught exception with an ended span.  Will automatically record the exception and end the span:

```javascript
{
  let span = Spans.startSpan(tracer, 'trap-and-throw');
  try {
    // do stuff
    span.ok();
  } catch (e) {
    // Trap and throw the exception
    span.doThrow(e);
  }
}
```

Return an error with an inline check using a custom exception type.  Will automatically record the error and end the span:

```javascript
{
  let span = Spans.startSpan(tracer, 'inline-error');
  try {
    // Check pre-conditions
    if (!requiredRef) {
      throw span.toError('required reference is not available', ReferenceError);
    }
    // do stuff
    span.ok();
  } catch (e) {
    // handle the error
  }
}
```

Return the caught exception with an ended span.  Will automatically record the exception and end the span:

```javascript
{
  let span = Spans.startSpan(tracer, 'trap-and-throw');
  try {
    // do stuff
    span.ok();
  } catch (e) {
    // Trap and re-throw the exception
    throw span.toThrow(e);
  }
}
```

Throw an error with an inline check.  Will automatically record the error and end the span:

```javascript
{
  let span = Spans.startSpan(tracer, 'inline-error');
  try {
    // Check pre-conditions
    if (!requiredVar) {
      span.doError('required value is not set');
    }
    // do stuff
    span.ok();
  } catch (e) {
    // handle the error
  }
}
```

Throw an error with an inline check using a custom exception type.  Will automatically record the error and end the span:

```javascript
{
  let span = Spans.startSpan(tracer, 'inline-error');
  try {
    // Check pre-conditions
    if (!requiredRef) {
      span.doError('required reference is not available', ReferenceError);
    }
    // do stuff
    span.ok();
  } catch (e) {
    // handle the error
  }
}
```

## Installation

Add the following dependency:

```bash
npm install @trietop/flotel
```

OpenTelemetry API Compliance:
```
'@opentelemetry/api': ^1.0.3
```

## Development

Check out the repository and run the following:

```bash
npm install
npm run build
```

Please provide all pull requests with an associated [issue](https://github.com/trietopsoft/flotel/issues/new) and branch.
### Jest

Jest tests are set up to run with `npm test`.
