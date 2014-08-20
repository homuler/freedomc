module Handler.FC.Typing.DeleteMusic where

import Import

postFCDeleteMusicR :: Text -> Handler Html
postFCDeleteMusicR numId = do
  let deleteId = fromText2Id numId :: FCTypingMusicId
  runDB $ delete deleteId
  redirect FCMusicListR
