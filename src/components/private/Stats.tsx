import React, { FC, useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';

import { makeStyles, Theme } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Tab from '@material-ui/core/Tab/Tab';
import Tabs from '@material-ui/core/Tabs/Tabs';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import GameResultsGrid from './GameResultsGrid';
import Leaderboards from './Leaderboards';
import GameResultsMap from './GameResultsMap';

// TODO: Move into own component
interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`wrapped-tabpanel-${index}`}
      aria-labelledby={`wrapped-tab-${index}`}
      className="tab-panel"
      {...other}
    >
      {value === index && children}
    </div>
  );
}

// TODO: Move into util file
function a11yProps(index: any) {
  return {
    id: `wrapped-tab-${index}`,
    'aria-controls': `wrapped-tabpanel-${index}`,
  };
}

interface IProps {}

const Stats: FC<IProps> = () => {
  const classes = useStyles();

  const history = useHistory();
  const { page } = useParams<any>();

  const [value, setValue] = useState<null | string>(null);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    history.push(`/stats/${newValue}`);
  };

  useEffect(() => {
    if (!page) {
      history.push('/stats/places');
    } else {
      setValue(page);
    }
  }, [page, history]);

  return (
    <div className={classes.root}>
      {value && (
        <>
          <AppBar position="static">
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              className={classes.backToHome}
              component={Link}
              to="/"
            >
              <ChevronLeftIcon />
            </IconButton>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="simple tabs example"
              centered
            >
              <Tab value="places" label="Places" {...a11yProps('places')} />
              <Tab
                value="leaderboards"
                label="Leaderboards"
                {...a11yProps('leaderboards')}
              />
              <Tab value="map" label="Map" {...a11yProps('map')} />
            </Tabs>
          </AppBar>
          <div className={classes.content}>
            <TabPanel value={value} index="places">
              <GameResultsGrid />
            </TabPanel>
            <TabPanel value={value} index="leaderboards">
              <Leaderboards />
            </TabPanel>
            <TabPanel value={value} index="map">
              <GameResultsMap />
            </TabPanel>
          </div>
        </>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  backToHome: {
    position: 'absolute',
    left: theme.spacing(2),
    zIndex: theme.zIndex.appBar + 1,
  },
  content: {
    flexGrow: 1,
    overflow: 'hidden',
    '& .tab-panel': {
      height: '100%',
      overflow: 'hidden',
    },
  },
}));

export default Stats;
