module FC.Form.Fields where

import Import
import qualified Data.List as L
import Data.Maybe
import Data.Either
import qualified Data.Text as T

multiCheckBoxList :: (Show a, Eq a, RenderMessage App msg) => [(msg, a)] -> Field Handler [a]
multiCheckBoxList xs = Field
  { fieldParse = \rawVals _fileInfo -> do
       opts <- optionsPairs xs
       let (leftList, rightList) = partitionEithers $ map (fieldParseHelper opts) rawVals
       $logInfo $ T.pack $ show rawVals
       if length leftList > 0
          then return $ Left $ L.head leftList
          else return $ Right $ Just $ catMaybes rightList
   ,fieldView = \idAttr nameAttr otherAttrs eResult isReq -> do
       opts' <- optionsPairs xs
       let opts = olOptions opts'
       $(widgetFile "field/multi-checkbox")
   ,fieldEnctype = UrlEncoded }
  where
    fieldParseHelper opts val = case val of
      "" -> Right Nothing
      v  -> case olReadExternal opts v of
        Nothing -> Left $ SomeMessage $ MsgInvalidEntry v
        Just x  -> Right $ Just x

multiDynamicCheckBox :: Monad m => RenderMessage (HandlerSite m) FormMessage => Field m [Text]
multiDynamicCheckBox = Field parse view UrlEncoded
  where
    parse [] _ = return $ Right Nothing
    parse optlist _ = return $ Right $ Just optlist
    view _ _ _ _ _ = [whamlet| |]
