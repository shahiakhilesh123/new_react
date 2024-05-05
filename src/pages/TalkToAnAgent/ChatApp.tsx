import React, {Suspense, useEffect, useState} from 'react';
import useIsMounted from 'ismounted';
import {GuestSession} from "../../types/internal";
import ChatApis from "../../apis/ChatGuest/chat.client";


function ChatApp({client_id, preview}: any) {
    const isMounted = useIsMounted();
    const [sessionResponse, setSessionResponse] = useState<GuestSession>();

    const [showChat, setShowChat] = useState<boolean>(preview);

    useEffect(() => {
        setShowChat(preview)
    }, [preview])
    useEffect(() => {
        new ChatApis().get_session(client_id).then(value => {
            if (isMounted.current) {
                if (ChatApis.hasError(value)) {

                } else {
                    setSessionResponse(value);
                }
            }

        })
    }, [isMounted, client_id]);
    const ChatController = React.lazy(() => import('../../components/ChatClient/chat/components/chat/Chat.Controller'));
    if (!sessionResponse) return null;


    return <Suspense fallback={null}>
        {
            sessionResponse.chat_session && sessionResponse.chat_settings && <ChatController
                key={sessionResponse.chat_session && sessionResponse.chat_session.id}
                restart_session={() => {
                    new ChatApis().get_session(client_id).then(value => {
                        if (isMounted.current) {
                            if (ChatApis.hasError(value)) {

                            } else {
                                setSessionResponse(value);
                                setShowChat(true)
                            }
                        }

                    })
                }}
                // @ts-ignore
                guest_session={sessionResponse.chat_session}
                ui_testing={false}
                preview={showChat}
                chat_settings={sessionResponse.chat_settings}
                logo_image={sessionResponse.chat_settings.bot_image}
            />
        }
    </Suspense>
}

export default ChatApp;


