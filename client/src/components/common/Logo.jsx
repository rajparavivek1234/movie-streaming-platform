import { Typography, useTheme } from '@mui/material';
import appLogo from "../../assets/easymovieLogo.png"

const Logo = () => {
  const theme = useTheme();

  return (
    <Typography fontWeight="700" fontSize="1.7rem">
    <img src={appLogo} alt='hello' style={{marginRight: '10px'}} height={45} width={45} />
      EasyWatch
      {/* <span style={{ color: theme.palette.primary.main }}>Watch</span> */}
    </Typography>
  );
};

export default Logo;