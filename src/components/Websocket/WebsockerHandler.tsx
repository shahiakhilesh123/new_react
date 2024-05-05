import React, {Dispatch, useContext, useEffect, useState} from "react";
import Pusher, {ChannelAuthorizationCallback} from "pusher-js"
import BaseAPIs from "../../apis/base.apis";
import {AppStateContext, ChatAppDispatchContext} from "../../App";
import {iChatAction} from "../../redux/reducers/chatReducer";
import Sound from "react-sound";
import {ChannelAuthorizationRequestParams} from "pusher-js/types/src/core/auth/options";

// @ts-ignore
window.Pusher = Pusher;
export default function WebsocketHandler() {
    const [playNotification, setPlayNotification] = useState<'PLAYING' | 'STOPPED' | 'PAUSED'>("STOPPED")
    const {loggedInUser} = useContext(AppStateContext);

    const dispatch: Dispatch<iChatAction> = useContext(ChatAppDispatchContext);
    useEffect(() => {
        if (loggedInUser) {
            let p = new Pusher(process.env.REACT_APP_PUSHER_APP_KEY || "", {
                authEndpoint: new BaseAPIs().getApiBaseURL() + '/broadcasting/auth',
                wsHost: process.env.REACT_APP_WS_HOST,
                wsPort: 443,
                authTransport: "ajax",
                httpHost: process.env.REACT_APP_WS_HOST,
                cluster: "eu",
                channelAuthorization: {
                    customHandler: (
                        params: ChannelAuthorizationRequestParams,
                        callback: ChannelAuthorizationCallback
                    ) => {
                        new BaseAPIs().post('/broadcasting/auth',
                            {
                                channel_name: params.channelName,
                                socket_id: params.socketId
                            },).then(value => {
                            if (BaseAPIs.hasError(value)) {
                                callback(value.message, null)
                            } else {
                                callback(null, {auth: value.auth})
                            }
                        })

                    },
                    params: "",
                    headers: "",
                    endpoint: "",
                    transport: "ajax"
                }

            });
            let channel = p.subscribe(`private-user.${loggedInUser.uid}.notifications`)
            channel.bind("chat.received.for.user", (e: any) => {
                if (e.message && e.message.from_guest) {
                    setPlayNotification("PLAYING")
                }

                if (e.message && e.session) {
                    if (e.message.from_guest) {
                       dispatch({type: "message", message: e.message, session: e.session})
                    }
                }
            })
        }


    }, [loggedInUser])
    return <>
        <Sound

            url="/sounds/rising-pops.mp3"
            playStatus={playNotification}
            loop={false}

            onError={() => {
            }}
            onFinishedPlaying={() => {
                setPlayNotification("STOPPED")
            }}
        />
    </>;
}
