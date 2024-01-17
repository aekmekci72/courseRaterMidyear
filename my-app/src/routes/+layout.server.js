/**
 * @typedef {Object} LoadResult
 * @property {any} session - Description of the session property.
 */

/**
 * @function
 * @async
 * @param {Object} event - Description of the event parameter.
 * @returns {Promise<LoadResult>}
 */
export const load = async (event) => {
    // Assuming 'event' has a property 'locals' with 'getSession' method
    const locals = (event && event.locals) || {};
    return {
      session: await locals.getSession(),
    };
  };
  