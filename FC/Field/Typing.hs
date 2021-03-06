module FC.Field.Typing where

import Import
import FC.Data.Typing
import qualified Data.Text as T

problemField :: T.Text -> Int -> Field Handler ProblemInfo
problemField lyric idNum = Field
  { fieldParse = \rawVals _fileInfo ->
     case rawVals of
       [d, p, st, et]
         | stDouble < etDouble -> do
                                  setSession (T.pack $ "problem" ++ show idNum) p
                                  setSession (T.pack $ "startTime" ++ show idNum) st
                                  setSession (T.pack $ "endTime" ++ show idNum) et
                                  return $ Right $ Just $ ProblemInfo d p stDouble etDouble
         | otherwise -> do
                        setSession (T.pack $ "problem" ++ show idNum) p
                        $logInfo $ T.pack $ "session " ++ (show idNum) ++ (T.unpack p)
                        return $ Left "Start Time must be before End Time."
            where stDouble = read $ T.unpack st :: Double
                  etDouble = read $ T.unpack et :: Double
       _ -> do
            $logInfo $ T.pack $ show rawVals
            return $ Left "There mustn't be blank fields."
   ,fieldView = \idAttr nameAttr otherAttrs eResult isReq ->
     $(widgetFile "fc/fc-problem-editor")
   ,fieldEnctype = UrlEncoded }

getEitherResult :: (Show b) => Either T.Text a -> (a -> b) -> Either T.Text T.Text
getEitherResult result f = (T.pack . show . f) <$> result
