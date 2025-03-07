import axios from 'axios';
import { isObject, isEmpty } from 'lodash';
import store from '..';
import { errorMessage } from '../actions/status_messages'; //  '../actions/status_messages'
import { lockPage } from '../actions/upgradePages';

import { refreshToken } from '../actions/auth';

const graphql = (query, variables, callbacks) => {
  const { auth, current_user } = store.getState();

  const locale =
    current_user.lang || (window.I18n && window.I18n.defaultLocale) || 'en';

  const config = {
    authorization: `Bearer ${auth.accessToken}`,
    lang: locale,
  };

  axios
    .create({
      baseURL: '/graphql',
    })
    .post(
      '',
      {
        query: query,
        variables: variables,
      },
      { headers: config }
    )
    .then((r) => {
      const data = r.data.data;
      const res = r;

      const errors = r.data.errors;

      if (isObject(errors) && !isEmpty(errors)) {
        // const errors = data[Object.keys(data)[0]];
        // callbacks['error'] ? callbacks['error'](res, errors['errors']) : null
        if (
          errors[0].extensions &&
          errors[0].extensions.code === 'unauthorized'
        ) {
          //@ts-ignore
          return store.dispatch(errorMessage(errors[0].message));
        }
        if (callbacks.error) {
          return callbacks.error(res, errors);
        }
      }

      callbacks.success ? callbacks.success(data, res) : null;
    })
    .catch((req) => {
      // throw r
      // const res = r.response
      // console.log("error on grapqhl client", req, error)
      switch (req.response.status) {
        case 500:
          //@ts-ignore
          store.dispatch(errorMessage('server error ocurred'));
          break;
        case 402:
          //
          //@ts-ignore
          store.dispatch(lockPage(req.response.data.error.message));
          // store.dispatch(errorMessage('server error ocurred'))
          break;
        case 401:
          // history.push("/")
          //@ts-ignore
          store.dispatch(errorMessage('session expired'));
          //@ts-ignore
          store.dispatch(refreshToken(auth));
          // store.dispatch(expireAuthentication())
          // refreshToken(auth)
          break;
        default:
          break;
      }

      callbacks.fatal ? callbacks.fatal('error fatale') : null;
    })
    .then((r) => {
      callbacks.always ? callbacks.always() : null;
    });
};

export default graphql;
