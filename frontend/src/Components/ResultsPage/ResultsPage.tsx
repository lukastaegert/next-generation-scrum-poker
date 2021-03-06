import sharedClasses from '../../styles.module.css';
import { CardValue, Votes, WebSocketApi } from '../../types/WebSocket';
import { IconCoffee } from '../IconCoffee';
import { IconNotVoted } from '../IconNotVoted';
import { IconObserver } from '../IconObserver';
import { connectToWebSocket } from '../WebSocket';
import { compareVotes } from './compareVotes';
import classes from './ResultsPage.module.css';
import {
  COLUMN_NAME,
  COLUMN_VOTE,
  HEADING_RESULTS,
  VOTE_COFFEE,
  VOTE_NOTE_VOTED,
  VOTE_OBSERVER,
} from '../../constants';

const getSortedResultsArray = (unsortedResults: Votes) => {
  let dataArray: [string, CardValue][] = Object.entries(unsortedResults);
  return dataArray.sort(compareVotes);
};

const getVote = (vote: CardValue) => {
  if (vote === VOTE_COFFEE) {
    return <IconCoffee />;
  }
  if (vote === VOTE_NOTE_VOTED) {
    return <IconNotVoted />;
  }
  if (vote === VOTE_OBSERVER) {
    return <IconObserver />;
  }
  return vote;
};

const getClassName = (vote: CardValue) =>
  vote === VOTE_NOTE_VOTED || vote === VOTE_OBSERVER ? classes.notVotedEntry : classes.votedEntry;

const ProtoResultsPage = ({ socket }: { socket: WebSocketApi }) => (
  <div class={classes.resultsPage}>
    <div class={sharedClasses.heading}>{HEADING_RESULTS}</div>
    <div class={sharedClasses.blueBorder}>
      <table class={sharedClasses.table}>
        <thead>
          <tr class={sharedClasses.headerRow}>
            <th>{COLUMN_NAME}</th>
            <th>{COLUMN_VOTE}</th>
          </tr>
        </thead>
        <tbody>
          {getSortedResultsArray(socket.state.votes).map((userAndVote) => {
            return (
              <tr key={userAndVote[0]}>
                <td>{userAndVote[0]}</td>
                <td class={getClassName(userAndVote[1])}>{getVote(userAndVote[1])}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
    <button
      class={sharedClasses.button}
      onClick={() => {
        socket.resetVotes();
      }}
    >
      Reset votes
    </button>
  </div>
);

export const ResultsPage = connectToWebSocket(ProtoResultsPage);
