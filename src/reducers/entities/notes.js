import merge from 'lodash/merge';
import union from 'lodash/union';

import * as types from '../../constants/ActionTypes';

function notes(state = {}, action) {
  switch (action.type) {
    case types.ADD_NOTE:
      return {
        ...state,
				[action.note.noteId]: action.note,
      };
		case types.LINK_TAG:
			return {
				...state,
				[action.noteId]: {
					...state[action.noteId],
					tags: [...state[action.noteId].tags, action.tag],
				}
			};
		case types.UNLINK_TAG:
			const deleted = state[action.noteId].tags.indexOf(action.tag);
			return {
				...state,
				[action.noteId]: {
					...state[action.noteId],
					tags: [
						...state[action.noteId].tags.slice(0, deleted),
						...state[action.noteId].tags.slice(deleted + 1),
					],
				}
			};
		case types.GET_NOTE_CONTENT_SUCCESS:
    case types.GET_NOTES_SUCCESS:
			// default value of note.tags is null, normalizr wont override it.
      for (let noteId in action.payload.entities.notes) {
				if (!action.payload.entities.notes[noteId].tags) {
					action.payload.entities.notes[noteId].tags = [];
				}
			};
      return {
				...state,
				...action.payload.entities.notes,
      };
    case types.UPDATE_NOTE_SUCCEEDED:
			// TODO DELETE
      return {
        ...state,
				[action.note.noteId]: action.note,
      };
    default:
      return state;
  }
}

export default notes;
