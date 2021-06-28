import React, { FC, useState } from 'react';

import { makeStyles, Theme } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import Alert from '@material-ui/lab/Alert';

import ClearIcon from '@material-ui/icons/Clear';
import CheckIcon from '@material-ui/icons/Check';
import EditIcon from '@material-ui/icons/Edit';
import LocationOffIcon from '@material-ui/icons/LocationOff';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import SaveIcon from '@material-ui/icons/Save';

import { useContext } from '../../context';

import Star from '../../img/star.png';
import StarOff from '../../img/star_off.png';
import Crown from '../../img/crown.png';
import CrownOff from '../../img/crown_off.png';

import IPlayer from '../../interfaces/IPlayer';

interface IProps {
  player: IPlayer;
}

const Player: FC<IProps> = ({ player }) => {
  const classes = useStyles();
  const [
    ,
    {
      editPlayer,
      activatePlayer,
      deactivatePlayer,
      deletePlayer,
      toggleUserPlayingState,
    },
  ] = useContext();
  const [menuElement, setMenuElement] = useState(null);
  const [dialog, setDialog] = useState<string | null>(null);

  const [editName, setEditName] = useState(player.name);

  const onDialogClose = () => {
    setDialog(null);
  };

  const handleClickMenuDialog = (type: string) => {
    setMenuElement(null);
    setDialog(type);
  };

  const handleClickEditSave = () => {
    editPlayer({ ...player, name: editName });
  };

  const handleClickDeactivateYes = () => {
    deactivatePlayer(player.id);
    setDialog(null);
  };

  const handleClickActivate = () => {
    activatePlayer(player.id);
    setDialog(null);
  };

  const handleClickDeleteYes = () => {
    deletePlayer(player.id);
    setDialog(null);
  };

  const handleClick = (event: any) => {
    setMenuElement(event.currentTarget);
  };

  const handleClose = () => {
    setMenuElement(null);
  };

  // TODO: use memo to hold value for perf increase
  const generateAlt = (isChamp: boolean) => {
    return isChamp ? 'crown' : 'star';
  };

  // TODO: use memo to hold value for perf increase
  const getImages = (isChamp: boolean) => {
    return isChamp ? [Crown, CrownOff] : [Star, StarOff];
  };

  const images = getImages(!!player.isCurrentChamp);
  const alt = generateAlt(!!player.isCurrentChamp);

  return (
    <div className={classes.root}>
      <div
        className={classes.content}
        onClick={() => toggleUserPlayingState(player.name)}
      >
        {player.playing && <img src={images[0]} alt={alt} />}
        {!player.playing && <img src={images[1]} alt={alt + ' off'} />}
        <Typography className="name" variant="h3">
          {player.name} {!player.active && <LocationOffIcon />}
        </Typography>
      </div>
      <div className="actions">
        <IconButton
          aria-controls={`player-menu-${player.id}`}
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MoreHorizIcon fontSize="small" />
        </IconButton>
        <Menu
          id={`player-menu-${player.id}`}
          anchorEl={menuElement}
          keepMounted
          open={Boolean(menuElement)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => handleClickMenuDialog('edit')}>
            <EditIcon className={classes.menuIcon} fontSize="small" /> Edit
          </MenuItem>
          {!player.active && (
            <MenuItem onClick={handleClickActivate}>
              <VisibilityIcon className={classes.menuIcon} fontSize="small" />{' '}
              Activate
            </MenuItem>
          )}
          {player.active && (
            <MenuItem onClick={() => handleClickMenuDialog('deactivate')}>
              <VisibilityOffIcon
                className={classes.menuIcon}
                fontSize="small"
              />{' '}
              Deactivate
            </MenuItem>
          )}
          <MenuItem onClick={() => handleClickMenuDialog('delete')}>
            <DeleteForeverIcon className={classes.menuIcon} fontSize="small" />{' '}
            Delete
          </MenuItem>
        </Menu>
      </div>
      {/* TODO: Move these to a separate component  */}
      <Dialog open={dialog === 'edit'} onClose={onDialogClose}>
        <DialogTitle>Edit a Player</DialogTitle>
        <DialogContent>
          <TextField
            variant="filled"
            label="name"
            value={editName}
            onChange={(event) => setEditName(event.target.value)}
          ></TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog(null)} startIcon={<ClearIcon />}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleClickEditSave()}
            startIcon={<SaveIcon />}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={dialog === 'deactivate'} onClose={onDialogClose}>
        <DialogTitle>Deactivate a Player</DialogTitle>
        <DialogContent>
          <Typography gutterBottom={true}>
            Are you sure you want to deactivate {player.name}?
          </Typography>
          <Alert severity="info">
            Deactivate a player will remove them from this listing.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog(null)} startIcon={<ClearIcon />}>
            No
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleClickDeactivateYes()}
            startIcon={<CheckIcon />}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={dialog === 'delete'} onClose={onDialogClose}>
        <DialogTitle>Delete a Player</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {player.name}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog(null)} startIcon={<ClearIcon />}>
            No
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleClickDeleteYes()}
            startIcon={<CheckIcon />}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'center',
    '& > .actions': {
      opacity: 0,
    },
    '&:hover > .actions': {
      opacity: 1,
    },
  },
  content: {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(),
    '& > img': {
      width: 50,
      height: 50,
      margin: theme.spacing(1, 2),
    },
  },
  menuIcon: {
    marginRight: theme.spacing(),
  },
}));

export default Player;
