import { each } from 'lodash'
export default ({
  dependencies: {
    errors,
    http: {
      status: {
        BAD_REQUEST,
        NOT_FOUND,
        INTERNAL_SERVER_ERROR,
        UNAUTHORIZED,
        FORBIDDEN,
        PRECONDITION_FAILED
      }
    }
  }
}) => {
  const {
    Validation,
    Unauthenticated,
    Unauthorized,
    NotFound,
    PreconditionFailed
  } = errors
  const map = {
    [BAD_REQUEST]: [ Validation ],
    [NOT_FOUND]: [ NotFound ],
    // The status code for unauthorized really means unauthenticated
    [UNAUTHORIZED]: [ Unauthenticated ],
    [FORBIDDEN]: [ Unauthorized ],
    [PRECONDITION_FAILED]: [ PreconditionFailed ]
  }
  return {
    get _map() {
      return map
    },
    addError: (type, status) => {
      const key = status.toString()
      if (!map[key]) {
        map[key] = []
      }

      map[key].push(type)
    },
    getErrorStatus: error => {
      let errorCode = INTERNAL_SERVER_ERROR
      each(map, (types, code) => {
        if (types.some(t => error instanceof t)) {
          errorCode = parseInt(code, 0)
        }
      })
      return errorCode
    }
  }
}
