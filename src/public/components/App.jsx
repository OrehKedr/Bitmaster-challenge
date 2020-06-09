import React from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import MapReduxContainer from '../containers/MapReduxContainer';
import SearchFormContainer from '../containers/SearchFormContainer';
import CrewListContainer from '../containers/CrewListContainer';

export class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container maxWidth="md" disableGutters={true}>
        <Box 
          borderBottom={1} 
          borderColor="text.secondary" 
          color="text.primary" 
          boxSizing="border-box" 
          mb={2}
        >
          <Typography variant="h6" component="h1" gutterBottom>
            Детали заказа
          </Typography>
        </Box>
        <SearchFormContainer />
        <Box 
          display="flex" 
          flexDirection="row" 
          flexWrap="wrap" 
          justifyContent="space-between" 
          p={2} 
          boxSizing="border-box"
        >
          <Box 
            width="55%" 
            minWidth="490px" 
            minHeight="320px" 
            pt={1} 
            boxSizing="border-box"
          >
            <MapReduxContainer />
          </Box>
          <Box width="40%" minWidth="327px" pt={1} boxSizing="border-box">
            <CrewListContainer />
          </Box>
        </Box>
      </Container>
    )
  }
}
