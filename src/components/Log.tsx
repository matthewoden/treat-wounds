import ListItemText from "@mui/material/ListItemText";
import { AbilityCheckOutcome } from "../diceroller/checks";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Divider } from "@mui/material";
import React from "react";

type LogProps = {
  outcomes: AbilityCheckOutcome[]
  onClear: () => void
}

const Log = (props: LogProps) => {
  return (
    <Box padding={2}>
      <Box display={'flex'} justifyContent={'space-between'}>
        <Typography variant="h6" sx={{fontWeight: 700}}>Log</Typography>
        <Button onClick={() => props.onClear()}>Reset</Button>
      </Box>
      <List sx={{  transform: 'rotate(180deg)'}}>
        {props.outcomes.map((check, index) => {
          return (
            <React.Fragment key={`${index}_${check}`}>
              <ListItem disablePadding sx={{transform: 'rotate(-180deg)', paddingTop: 1}} >
                <ListItemText
                  primary={(
                    <>
                      <Typography
                        component={"span"}
                        variant="body1"
                        >
                        {check.value} Health
                      </Typography>
                    </>
                  )}
                  secondary={(
                    <>
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="overline"
                        color={"text.secondary"}
                      >
                        {check.d20Result} Roll + {check.modifier} Med  +  {check.bonus} Aid = {check.result}
                      </Typography>
                    </>
                  )}
                />
              </ListItem>
              {index + 1 !== props.outcomes.length && <Divider/> }
            </React.Fragment>
        )})}
      </List>
    </Box>
  )
}

export default Log
