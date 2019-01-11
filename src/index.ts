// react
import * as React from 'react'
const r = React.createElement
import { render } from 'react-dom'
import { br, div, hr, img, li, tbody, td, th, thead, tr, ul } from 'react-dom-factories'
import { BrowserRouter as Router, NavLink } from 'react-router-dom'

// redux
import { connect, Provider } from 'react-redux'
import { applyMiddleware, createStore, Store} from 'redux'
import { createEpicMiddleware, Epic, ofType } from 'redux-observable'

// rxjs
import { Observable } from 'rxjs'
import { mergeMap, map, catchError } from 'rxjs/operators'
import { ajax } from 'rxjs/ajax'

// typestyle
// import { style } from 'typestyle'

// react-bootstrap
import { Table } from 'react-bootstrap'
import { withRouter } from 'react-router'

// model
interface User {
  id: number,
  login: string,
  url: string,
  avatar_url: string,
}

interface State {
  users: User[]
}

// action
type Action =
  | { type: 'FETCH_USERS' }
  | { payload: User[], type: 'FETCH_USERS_FULFILLED' }

const fetchUsers = (): Action => ({
  type: 'FETCH_USERS',
})

const fetchUsersFulfilled = (payload: User[]): Action => ({
  payload,
  type: 'FETCH_USERS_FULFILLED',
})

interface EpicDependencies {
  getJSON: (url: string) => Observable<User[]>
}

export const fetchUsersEpic:
  Epic<Action, Action, void, EpicDependencies> =
  (action$, _, { getJSON }) =>
    action$.pipe(
      ofType('FETCH_USERS'),
      mergeMap(() =>
        getJSON('https://api.github.com/users?since=1&per_page=5').pipe(
          map(response => fetchUsersFulfilled(response)),
          catchError((error) => console.log(`error: ${error}`) as never)
        )
      )
    )

// reducers
const users = (state: State, action: Action): State => {
  switch (action.type) {
    case 'FETCH_USERS_FULFILLED':
      return {
        ...state,
        users: action.payload,
      }
    default:
      return state
  }
}

// views
const home = () => {
  return div({},
    div({}, 'home page'),
  )
}

// tslint:disable-next-line:variable-name
const _about: React.SFC<{ state: State }> = ({ state }) =>
  div({},
    div({}, 'about page'),
    r(Table, { responsive: true },
      thead({},
        tr({},
          th({}, '#'),
          th({}, 'Username'),
          th({}, 'Url'),
          th({}, 'Avatar'),
        ),
      ),
      tbody({},
        (state.users).map((user: User, index: number) =>
          tr({ key: user.id },
            td({}, index),
            td({}, user.login),
            td({}, user.url),
            td({},
              img({ src: user.avatar_url, height: '32', width: '32' }),
            ),
          ),
        ),
      ),
    ),
  )

const about = connect(
  (state: State) => ({ state }),
)(_about)

const topics = () =>
  div({},
    div({}, 'topic page'),
  )

// tslint:disable-next-line:variable-name
const _ConnectedContainer: React.SFC<{ location: any }> = ({ location }) =>
    div({},
      location.pathname,
      br({}),
      br({}),
      location.pathname === '/'
        ? r(home)
        : location.pathname === '/about'
          ? r(about)
          : location.pathname === '/topics'
            ? r(topics)
            : r(home),
    )

const ConnectedContainer = withRouter(
  connect(
    (_: State, ownProps: any) => ({ location: ownProps.location }),
  )(_ConnectedContainer) as any)

interface RootProps {
  store: Store<State>
}

// tslint:disable-next-line:no-shadowed-variable
const Root: React.SFC<RootProps> = ({ store }) =>
  r(Provider, { store },
    r(Router, {},
      div({ className: 'container mt-3' },
        ul({},
          li({}, r(NavLink, { to: '/' }, 'Home')),
          li({}, r(NavLink, { to: '/about' }, 'About')),
          li({}, r(NavLink, { to: '/topics' }, 'Topics')),
        ),
        hr({}),
        r(ConnectedContainer),
      ),
    ),
  )

const epicMiddleware = createEpicMiddleware({
  dependencies: {
    getJSON: ajax.getJSON,
  },
})

const initialState: State = {
  users: [],
}

const store = createStore(users, initialState, applyMiddleware(epicMiddleware))

epicMiddleware.run(fetchUsersEpic)

// render
render(
  r(Root, { store }),
  document.getElementById('root'),
)

store.dispatch(fetchUsers())
