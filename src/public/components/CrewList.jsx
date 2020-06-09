import React from 'react';
import PropTypes from 'prop-types';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import LocalTaxiIcon from '@material-ui/icons/LocalTaxi';


const styles = {
  list: {
    width: '100%',
    maxWidth: 360,
    border: '1px solid rgba(0, 0, 0, 0.12)'
  }
};

export default class CrewList extends React.Component {
  static propTypes = {
    crewList: PropTypes.array.isRequired
  };
  constructor(props) {
    super(props);
  }

  render() {
    let children = null;
    const { crewList } = this.props;

    if (crewList.length == 0) {
      children = 
        <React.Fragment key="no_crew">
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <LocalTaxiIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="нет достуных экипажей" secondary="цвет кузова" />
          </ListItem>
        </React.Fragment>
    } else {
      children = crewList.map((child, index, array) => {
        return (
          <React.Fragment key={child.crew_id}>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <LocalTaxiIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={child.car_model} secondary={child.car_color} />
              <ListItemText primary={`${child.distance} м`} />
            </ListItem>
            {(index === array.length - 1) ? '' : <Divider />}
          </React.Fragment>
        );
      });
    }

    return (
      <List style={styles.list}>
        {children}
      </List>
    )
  }

}
