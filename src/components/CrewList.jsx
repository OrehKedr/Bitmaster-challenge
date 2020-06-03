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

  render() {
    const children = this.props.crewList.map((child, index, array) => {
      return (
        <React.Fragment key={child.id + child.model}>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <LocalTaxiIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={child.model} secondary={child.color} />
          </ListItem>
          {(index === array.length - 1) ? '' : <Divider />}
        </React.Fragment>
      );
    });

    return (
      <List style={styles.list}>
        {children}
      </List>
    )
  }
}