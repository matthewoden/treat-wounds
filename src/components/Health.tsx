import Box from "@mui/material/Box";
import { AbilityCheckOutcome } from "../diceroller/checks";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

export const HealthOutcome = ({outcome}: {outcome: AbilityCheckOutcome | null}) => {
  return (
    <Box display={'flex'} flexDirection={'column'} flexGrow={1} paddingLeft={3} paddingTop={3}>
      <Typography variant="h5" alignSelf={'center'} sx={{fontWeight: 700}}>Health:</Typography>
      {outcome && (
        <Box display={'flex'} flexDirection={'column'} gap={1}>
          <Typography variant="h4" alignSelf={'center'}>{outcome.value}</Typography>
          <Box display={'flex'} flexDirection={'row'} justifyContent={'space-around'}>
            <Typography variant="overline">{outcome.result}</Typography>
            <Divider orientation='vertical'/>
            <Typography variant="overline">{outcome.total}</Typography>
          </Box>
        </Box>
      )}
    </Box>
  )
}
