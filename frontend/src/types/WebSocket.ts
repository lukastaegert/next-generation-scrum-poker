import { VOTE_COFFEE, VOTE_NOTE_VOTED, VOTE_OBSERVER } from '../constants';

export type CardValue = string;

export interface Votes {
  [userId: string]: CardValue;
}

export interface WebSocketState {
  resultsVisible: boolean;
  votes: Votes;
  scale: Array<CardValue>;
}

export interface WebSocketApi {
  connected: boolean;
  state: WebSocketState;
  loginData: WebSocketLoginData;
  loggedIn: boolean;
  login(user: string, session: string): void;
  setVote(vote: CardValue): void;
  setScale(scale: Array<CardValue>): void;
  revealVotes(): void;
  resetVotes(): void;
  removeUsersNotVoted(): void;
}

export interface StateMessage {
  type: 'state';
  payload: WebSocketState;
}

export interface NotLoggedInMessage {
  type: 'not-logged-in';
}

export interface LoginMessage {
  type: 'login';
  payload: {
    user: string;
    session: string;
  };
}

export interface SetVoteMessage {
  type: 'set-vote';
  payload: {
    vote: CardValue;
  };
}

export interface SetScaleMessage {
  type: 'set-scale';
  payload: {
    scale: Array<CardValue>;
  };
}

export interface RevealVotesMessage {
  type: 'reveal-votes';
}

export interface ResetVotesMessage {
  type: 'reset-votes';
}

export interface RemoveUsersNotVotedMessage {
  type: 'remove-users-not-voted';
}

export type WebsocketMessage =
  | StateMessage
  | NotLoggedInMessage
  | LoginMessage
  | SetVoteMessage
  | SetScaleMessage
  | RevealVotesMessage
  | ResetVotesMessage
  | RemoveUsersNotVotedMessage;

export type WebSocketLoginData = { user: string; session: string };
