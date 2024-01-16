/**
 * @typedef {Object} Student
 * @property {string} propertyName - Description of the property.
 */

/**
 * @typedef {Object} LoadResult
 * @property {any} session - Description of the session property.
 */

/** @type {LoadResult} */
export const load = async (event) => {
    return {
      session: await event.locals.getSession(),
    };
  };
  