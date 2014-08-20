module Handler.FC.Admin.UserList where

import Import

getUserListR :: Handler Html
getUserListR = do
  userList <- runDB $ selectList [] [] :: Handler [Entity User]
  let userPairs = zip [1..] userList :: [(Int, Entity User)]
  defaultLayout
    $(widgetFile "fc/admin/fc-userlist")
