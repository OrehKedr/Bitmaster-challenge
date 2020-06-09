import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import LocalTaxiIcon from '@material-ui/icons/LocalTaxi';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';


const classes = {
  car_number: {
    width: 100,
    height: 26,
    color: 'black',
    fontSize: 16,
    fontWeight: 600,
    textTransform: 'uppercase',
    border: '3px solid rgba(0, 0, 0, 0.12)',
    borderRadius: '5px'
  }
};

export default class CrewCard extends React.Component {
  static propTypes = {
    crewList: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {
    const crew = this.props.crewList[0];

    return (
      <Card variant="outlined">
        <CardHeader
          avatar={
            <Avatar>
              <LocalTaxiIcon />
            </Avatar>
          }
          title={ crew ? crew.car_model : 'нет достуных экипажей' }
          subheader={ crew ? crew.car_color : 'цвет автомобиля' }
          titleTypographyProps={{ variant:'h6' }}
        />
        <CardContent>
          <Box 
            display="flex" 
            justifyContent="center" 
            alignContent="center" 
          >
            <Typography style={classes.car_number} align='center' display='block'>
              {crew ? crew.car_number : 'номер'}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    )
  }
  
}
