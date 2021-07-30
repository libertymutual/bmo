import ExtendableError from 'extendable-error'
class Unauthorized extends ExtendableError {}
class Validation extends ExtendableError {}
class Unauthenticated extends ExtendableError {}
class NotFound extends ExtendableError {}
class PreconditionFailed extends ExtendableError {}

export default () => ({
  Unauthorized,
  Unauthenticated,
  Validation,
  NotFound,
  PreconditionFailed,
  // To avoid conflicts with global Error
  ExtendableError
})
