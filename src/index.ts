// react
import * as React from 'react'
const r = React.createElement
import { render } from 'react-dom'
import { br, button, div, hr, img, input, label, li, tbody, td, th, thead, tr, ul } from 'react-dom-factories'
import { BrowserRouter as Router, NavLink } from 'react-router-dom'

// redux
import { connect, Provider } from 'react-redux'
import { applyMiddleware, createStore, Store} from 'redux'
import { createEpicMiddleware, Epic, ofType } from 'redux-observable'

// rxjs
import { Observable } from 'rxjs'
// tslint:disable-next-line:no-submodule-imports
import { ajax } from 'rxjs/ajax'
// tslint:disable-next-line:no-submodule-imports
import { catchError, map, mergeMap } from 'rxjs/operators'

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
  skip: number,
  take: number,
  search: string,
  users: User[]
}

// action
type Action =
  | { type: 'FETCH_USERS', skip: number, take: number, search: string }
  | { type: 'FETCH_USERS_FULFILLED', skip: number, take: number, search: string, users: User[] }

const fetchUsers = (search: string, skip: number, take: number): Action => ({
  search,
  skip,
  take,
  type: 'FETCH_USERS',
})

const fetchUsersFulfilled = (search: string, skip: number, take: number, users: User[]): Action => ({
  search,
  skip,
  take,
  type: 'FETCH_USERS_FULFILLED',
  users,
})

interface EpicDependencies {
  getJSON: (url: string) => Observable<User[] | { items: User[] }>
}

export const fetchUsersEpic:
  Epic<Action, Action, State, EpicDependencies> =
  (action$, _, { getJSON }) =>
    action$.pipe(
      ofType('FETCH_USERS'),
      mergeMap((action) => {
        const { search, skip, take } = action
        const query = search === '' ? 'users?' : `search/users?q=${search}&`
        return getJSON(`https://api.github.com/${query}since=${skip + 1}&per_page=${take}`).pipe(
          map(response =>
            fetchUsersFulfilled(search, skip, take,
              search === '' ? response as User[] : (response as { items: User[] }).items)),
          // tslint:disable-next-line:no-console
          catchError((error) => console.log(`error: ${error}`) as never),
        )
      }),
    )

// reducers
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'FETCH_USERS_FULFILLED':
      return {
        ...state,
        search: action.search,
        skip: action.skip,
        take: action.take,
        users: action.users,
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
    br(),
    div({ className: 'form-group' },
      label({}, 'Filter'),
      input({
        className: 'form-control',
        onChange: (e) => store.dispatch(fetchUsers(e.target.value, state.skip, state.take)),
      }),
    ),
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
    button({
      className: `btn btn-link ${state.skip < 5 ? 'disabled' : ''}`,
      onClick: () => store.dispatch(fetchUsers(state.search, state.skip - state.take, state.take)),
    }, 'Previous'),
    button({
      className: `btn btn-link ${state.users.length < 5 ? 'disabled' : ''}`,
      onClick: () => store.dispatch(fetchUsers(state.search, state.skip + state.take, state.take)),
    }, 'Next'),
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

const epicMiddleware = createEpicMiddleware<Action, Action, State, EpicDependencies>({
  dependencies: {
    getJSON: ajax.getJSON,
  },
})

const initialState: State = {
  search: '',
  skip: 0,
  take: 5,
  users: [],
}

const store: any = createStore(reducer, initialState, applyMiddleware(epicMiddleware))

epicMiddleware.run(fetchUsersEpic)

// render
render(
  r(Root, { store }),
  document.getElementById('root'),
)

store.dispatch(fetchUsers(initialState.search, initialState.skip, initialState.take))
