import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { compose, fromRenderProps } from 'recompose';

import { UserContext } from '../Context/userContext';
import { withFirebase } from '../Components/Firebase/context';
import { onAuthUserListener } from '../Components/Firebase/firebase'



const withAuthorization = condition => Component => {
  function WithAuthorization() {
    const history = useHistory();

    useEffect(() => {
      onAuthUserListener(

        authUser => {

          if (!condition(authUser)) {
            history.push('/');
          }
        },
        // () => props.history.push('/'),
        () => history.push('/'),
      );
    }, [])
    return (
      <UserContext.Consumer>
        {authUser =>
          authUser[0] ?
            condition(authUser[0]) ? <Component /> : console.log('!!!!!tuk1 => ', authUser[0].role !== "banned")


            : null

        }
      </UserContext.Consumer>
    );
  }

  return compose(
    withRouter,
    withFirebase,
  )(WithAuthorization);
};

export default withAuthorization;