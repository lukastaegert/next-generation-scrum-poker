import { SCALES, SELECT_CHANGE_SCALE } from '../constants';
import { WebSocketApi } from '../types/WebSocket';
import classes from './ScaleSelector.module.css';
import { connectToWebSocket } from './WebSocket';

const ProtoScaleSelector = ({ socket }: { socket: WebSocketApi }) => {
  const updateScale = (scale: string) => {
    const cardValues = SCALES[scale].values;
    socket.setScale(cardValues);
  };

  const updateScaleManually = (scaleString: string) => {
    const cardValues = scaleString.split(',');
    socket.setScale(cardValues);
  };

  return (
    <div class={classes.container}>
      <select
        name="scale"
        class={classes.select}
        onChange={(e) => updateScale((e.target as HTMLSelectElement).value)}
        value={'CHANGE_SCALE'}
      >
        <option value="CHANGE_SCALE" disabled>
          {SELECT_CHANGE_SCALE}
        </option>
        {Object.keys(SCALES).map((id) => (
          <option value={id} key={id}>
            {SCALES[id].name}
          </option>
        ))}
      </select>
      <input
        type="text"
        name="scale-text"
        class={classes.input}
        onChange={(e) => updateScaleManually((e.target as HTMLInputElement).value)}
        value={socket.state.scale.join(',')}
      />
    </div>
  );
};

export const ScaleSelector = connectToWebSocket(ProtoScaleSelector);
