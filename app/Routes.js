import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes';
import App from './containers/App';
import ActivityPage from './containers/ActivityPage';

export default () => (
  <App>
    <Switch>
      <Route path={routes.ACTIVITY} component={ActivityPage} />
    </Switch>
  </App>
);
