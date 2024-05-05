import {iChatMessage, iChatSession} from "../../types/internal";

export interface iChatStats {
    unread_count: number
}

export interface iChatMessagesSession {
    session_id: number,
    messages: iChatMessage[]
}


export type ChatState = {
    chat_stats?: iChatStats,
    sessions?: iChatSession[],
    sessions_total?: number,
    sessions_page?: number,
    sessions_per_page?: number,
    active_sessions?: iChatSession[],
    active_total?: number,
    active_page?: number,
    active_per_page?: number,
}

export type iChatAction =
    { type: 'chat_stats', chat_stats: iChatStats }
    | { type: 'sessions', sessions: iChatSession[], total: number, page: number, per_page: number }
    | { type: 'active_sessions', sessions: iChatSession[], total: number, page: number, per_page: number }
    | { type: 'replace_message', message: iChatMessage, replace_with_id: number, session: iChatSession }
    | { type: 'message', message: iChatMessage, session: iChatSession }
    | { type: 'messages', messages: iChatMessage[], session: iChatSession }
    ;

export function chatReducer(state: ChatState, action: iChatAction): ChatState {
    let state_to_updated = {...state};
    switch (action.type) {
        case 'chat_stats':
            return {...state, chat_stats: action.chat_stats};
        case 'message':
            let message = action.message;
            if (state.sessions && state.sessions.length > 0) {
                let s = [...state.sessions];
                let session
                    = s.find((v) => {
                    return message.session_id && v.id.toString() === message.session_id.toString()
                })
                if (!session) {
                    s.splice(0, 0, action.session);
                    session = s.find((v) => {
                        return message.session_id && v.id.toString() === message.session_id.toString()
                    });
                }
                if (session) {

                    if (!session.messages) {
                        session.messages = []
                    }
                    session.agent_unread_messages = action.session.agent_unread_messages;
                    session.last_message = action.session.last_message;
                    let _message_already_exist = session.messages.findIndex(value => value.id && action.message.id && value.id.toString() === action.message.id.toString()) !== -1;
                    if (!_message_already_exist) {
                        let messages = [...session.messages, message];

                        if (!session.messages) {
                            session.messages = []
                        }

                        session.messages = [...messages]
                        state_to_updated = {...state_to_updated, sessions: s};

                    }

                }
            }
            if (state.active_sessions && state.active_sessions.length > 0) {
                let s = [...state.active_sessions];
                let session
                    = s.find((v) => {
                    return message.session_id && v.id.toString() === message.session_id.toString()
                })
                if (!session) {
                    s.splice(0, 0, action.session);
                    session = s.find((v) => {
                        return message.session_id && v.id.toString() === message.session_id.toString()
                    });
                }
                if (session) {
                    if (!session.messages) {
                        session.messages = []
                    }
                    session.agent_unread_messages = action.session.agent_unread_messages;
                    session.last_message = action.session.last_message;
                    let _message_already_exist = session.messages.findIndex(value => value.id && action.message.id && value.id.toString() === action.message.id.toString()) !== -1;
                    if (!_message_already_exist) {
                        let messages = [...session.messages, {...message}];

                        if (!session.messages) {
                            session.messages = []
                        }

                        session.messages = [...messages]

                        state_to_updated = {...state_to_updated, active_sessions: s};

                    }

                }
            }
            return {...state_to_updated}
        case 'messages':

            let messages = action.messages;
            if (state.sessions && state.sessions.length > 0) {
                let s = [...state.sessions];
                let session = s.find(value => {
                    return value.id.toString() === action.session.id.toString()
                })
                if (session) {
                    if (!session.messages) {
                        session.messages = []
                    }


                    for (let i = 0; i < messages.length; i++) {
                        let message_already_exist = session.messages.findIndex(value => value.id && messages[i].id && value.id.toString() === messages[i].id.toString()) !== -1;
                        if (!message_already_exist) {
                            session.messages.push(messages[i])
                        }
                    }
                    if (session && session.messages) {
                        session.messages.sort((a, b) => {
                            return a.id && b.id && (a.id - b.id);
                        })
                    }
                    state_to_updated = {...state_to_updated, sessions: [...s]};

                }
            }
            if (state.active_sessions && state.active_sessions.length > 0) {
                let s = [...state.active_sessions];
                let session = s.find(value => {
                    return value.id.toString() === action.session.id.toString()
                })
                if (session) {
                    if (!session.messages) {
                        session.messages = []
                    }


                    for (let i = 0; i < messages.length; i++) {
                        let message_already_exist = session.messages.findIndex(value => value.id && messages[i].id && value.id.toString() === messages[i].id.toString()) !== -1;
                        if (!message_already_exist) {
                            session.messages.push(messages[i])
                        }
                    }
                    if (session && session.messages) {
                        session.messages.sort((a, b) => {
                            return a.id && b.id && (a.id - b.id);
                        })
                    }
                    state_to_updated = {...state_to_updated, active_sessions: [...s]};

                }
            }
            return {...state_to_updated}
        case 'replace_message':
            if (state.sessions && state.sessions.length > 0) {
                let s = [...state.sessions];
                let session = s.find(value => {
                    return value.id.toString() === action.session.id.toString()
                })
                if (session) {
                    if (!session.messages) {
                        session.messages = []
                    }
                    let __message_already_exist = session.messages.findIndex(value => value.id.toString() === action.message.id.toString()) !== -1;
                    let __replace_message_exist = session.messages.findIndex(value => value.id.toString() === action.replace_with_id.toString()) !== -1;
                    if (!__message_already_exist && __replace_message_exist) {
                        let messages = [...session.messages];

                        let message_index = messages.findIndex(value => value.id === action.replace_with_id);
                        if (message_index !== -1 && action.message) {

                            messages[message_index].message = action.message.message;
                            messages[message_index].id = action.message.id;
                            messages[message_index].uid = action.message.uid;
                            messages[message_index].created_at = action.message.created_at;
                            messages[message_index].updated_at = action.message.updated_at;
                            messages[message_index].attachment_full_url = action.message.attachment_full_url;
                            messages[message_index].attachment_mime_type = action.message.attachment_mime_type;
                            messages[message_index].attachment_size = action.message.attachment_size;
                            // messages[message_index].from_guest = action.message.from_guest;
                        }
                        session.messages = messages;
                        let session_index = state.sessions.findIndex(value => value.id === action.session.id)
                        if (session_index !== -1) {
                            let sessions = state.sessions ? [...state.sessions] : []
                            sessions[session_index] = session
                            state_to_updated = {...state_to_updated, sessions: sessions};

                        }

                    }
                }

            }
            if (state.active_sessions && state.active_sessions.length > 0) {
                let s = [...state.active_sessions];
                let session = s.find(value => {
                    return value.id.toString() === action.session.id.toString()
                })
                if (session) {
                    if (!session.messages) {
                        session.messages = []
                    }
                    let __message_already_exist = session.messages.findIndex(value => value.id.toString() === action.message.id.toString()) !== -1;
                    let __replace_message_exist = session.messages.findIndex(value => value.id.toString() === action.replace_with_id.toString()) !== -1;
                    if (!__message_already_exist && __replace_message_exist) {
                        let messages = [...session.messages];

                        let message_index = messages.findIndex(value => value.id === action.replace_with_id);
                        if (message_index !== -1 && action.message) {

                            messages[message_index].message = action.message.message;
                            messages[message_index].id = action.message.id;
                            messages[message_index].uid = action.message.uid;
                            messages[message_index].created_at = action.message.created_at;
                            messages[message_index].updated_at = action.message.updated_at;
                            messages[message_index].attachment_full_url = action.message.attachment_full_url;
                            messages[message_index].attachment_mime_type = action.message.attachment_mime_type;
                            messages[message_index].attachment_size = action.message.attachment_size;
                            // messages[message_index].from_guest = action.message.from_guest;
                        }
                        session.messages = messages;
                        let session_index = state.active_sessions.findIndex(value => value.id === action.session.id)
                        if (session_index !== -1) {
                            let sessions = state.active_sessions ? [...state.active_sessions] : [];
                            sessions[session_index] = session;
                            state_to_updated = {...state_to_updated, active_sessions: sessions};

                        }

                    }
                }

            }
            return {...state_to_updated};
        case "sessions":
            let old_sessions = (state.sessions && [...state.sessions]) || [];
            let new_sessions: iChatSession[] = [];
            for (let i = 0; i < action.sessions.length; i++) {
                let session_exist = old_sessions.find(value => {
                    return value.id === action.sessions[i].id;
                });
                if (!session_exist) {
                    new_sessions.push(action.sessions[i]);
                } else {
                    new_sessions.push({
                        ...action.sessions[i],
                        messages: session_exist.messages
                    });
                }
            }
            if (new_sessions) {
                new_sessions.sort((a, b) => {
                    if (a.last_message && b.last_message && a.last_message.created_at && b.last_message.created_at) {
                        return new Date(b.last_message.created_at).getTime() - new Date(a.last_message.created_at).getTime();
                    }
                    return a.id && b.id && (a.id - b.id);
                })
            }
            return {
                ...state,
                sessions: new_sessions,
                sessions_page: action.page,
                sessions_per_page: action.per_page,
                sessions_total: action.total
            };
        case "active_sessions":
            let old_active_sessions = (state.sessions && [...state.sessions]) || [];
            let new_active_sessions: iChatSession[] = [];
            for (let i = 0; i < action.sessions.length; i++) {
                let session_exist = old_active_sessions.find(value => {
                    return value.id === action.sessions[i].id;
                });
                if (!session_exist) {
                    new_active_sessions.push(action.sessions[i]);
                } else {
                    new_active_sessions.push({
                        ...action.sessions[i],
                        messages: session_exist.messages
                    });
                }
            }
            if (new_active_sessions) {
                new_active_sessions.sort((a, b) => {
                    if (a.last_message && b.last_message && a.last_message.created_at && b.last_message.created_at) {
                        return new Date(b.last_message.created_at).getTime() - new Date(a.last_message.created_at).getTime();
                    }
                    return a.id && b.id && (a.id - b.id);
                })
            }
            return {...state,
                active_sessions: new_active_sessions,
                active_page: action.page,
                active_per_page: action.per_page,
                active_total: action.total
            };
        default:
            return {...state};
    }
}
