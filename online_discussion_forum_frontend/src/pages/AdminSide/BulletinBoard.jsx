import { Box, Button, Card, CardContent, CardMedia, Grid, IconButton, Menu, MenuItem, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CreateBoard from '../../modals/CreateBoard'
import { NavLink } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useLocation, useNavigate } from 'react-router-dom/dist/umd/react-router-dom.development';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const BulletinBoard = () => {
  const [forums, setForums] = useState();
  const [sortOrder, setSortOrder] = useState('newToOld');
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const handleForumClick = (forumId) => {
    navigate(`/admin/${forumId}/threads`)
  }

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getForums = async () => {
      try {
        const response = await axiosPrivate.get('/forums', {
          signal: controller.signal
        });
        const forumData = response.data.forums.map(forum => ({
          _id: forum._id,
          forumName: forum.name,
          creator: forum.creator,
          image: forum.image,
          creatorId: forum.user,
          description: forum.description,
          creationTime: new Date(forum.creationTime).toLocaleString(),
          threads: forum.threads,
          type: forum.type
        }));

        const sortedThreads = forumData.sort((a, b) => {
          return sortOrder === 'newToOld'
            ? new Date(b.creationTime) - new Date(a.creationTime)
            : new Date(a.creationTime) - new Date(b.creationTime);
        });

        isMounted && setForums(sortedThreads);
      } catch (err) {
        console.log(err)
        navigate('/admin/login', { state: { from: location }, replace: true });
      }
    }

    getForums();

    return () => {
      isMounted = false;
      controller.abort();
    }
  }, [axiosPrivate, sortOrder]);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
  };

  return (
    <Box display={'flex'} flexDirection={'column'} width={'65dvw'}>
      <Stack direction={'row'} justifyContent={'space-between'} sx={{ marginBottom: '20px' }}>
        <Typography variant="h5" sx={{ fontWeight: '700', fontSize: '30px', paddingRight: '50%' }}>Bulletin Board List</Typography>
        <CreateBoard />
      </Stack>
      <Stack direction={'row'} spacing={2} marginBottom={'20px'}>
        <Button onClick={() => handleSortChange('newToOld')} variant={sortOrder === 'newToOld' ? 'contained' : 'outlined'}>
          New to Old
        </Button>
        <Button onClick={() => handleSortChange('oldToNew')} variant={sortOrder === 'oldToNew' ? 'contained' : 'outlined'}>
          Old to New
        </Button>
      </Stack>

      {forums?.length ? (
        <Grid container spacing={2} direction={'column'} width={'70vw'}>
          {forums.map((forum) => (
            forum.type === "Bulletin" ? (
              <Grid item key={forum._id}>
                <Card sx={{ border: '1px solid #ccc', borderRadius: '8px', display: 'flex', flexDirection: 'row' }}>
                  <CardContent onClick={() => handleForumClick(forum._id)} style={{ cursor: 'pointer', width: '55vw' }}>
                    <Box display={'flex'} flexDirection={'row'}>
                      <Box width={'100%'}>
                        <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                          <Typography variant="h5" fontWeight={800}>{forum.forumName}</Typography>
                          <Box>
                            <IconButton aria-label="more" color="primary" onClick={(e) => {
                              e.stopPropagation();
                              handleClick(e);
                            }}>
                              <MoreHorizIcon />
                            </IconButton>
                            <Menu
                              id="options-menu"
                              anchorEl={anchorEl}
                              open={Boolean(anchorEl)}
                              onClose={(e) => {
                                e.stopPropagation();
                                handleClose();
                              }}
                              autoFocus={true}
                            >
                              <MenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleClose();
                                }}
                              >Edit</MenuItem>
                              <MenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleClose();
                                }}
                              >Delete</MenuItem>
                            </Menu>
                          </Box>
                        </Stack>
                        <Box style={{ maxHeight: '50px', overflowY: 'auto' }}>
                          <Typography marginBottom={'5px'}>{forum.description}</Typography>
                        </Box>
                        <div onClick={(e) => e.stopPropagation()} style={{ marginBottom: '5px', display: 'flex', flexDirection: 'row', gap: 5 }}>
                          <Typography>Creator: </Typography>
                          <NavLink style={{ textDecoration: 'underline' }} to={`/admin/${forum.creatorId}`}>{forum.creator}</NavLink>
                        </div>
                        <Typography marginBottom={'5px'}>{forum.creationTime}</Typography>
                        <Typography marginBottom={'5px'}>Total Threads: {forum.threads.length}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                  <Box>
                    <CardMedia
                      component="img"
                      onClick={() => handleForumClick(forum._id)}
                      style={{ borderTopRightRadius: '8px', borderBottomRightRadius: '8px', height: '100%', width: '32vw', maxHeight: '2500px', objectFit: 'cover', marginRight: '20px', cursor: 'pointer' }}
                      image={forum.image !== '' ? `https://dycihub-api.vercel.app/images/${forum.image}` : 'https://fakeimg.pl/200x100/?retina=1&text=こんにちは&font=noto'}
                      alt={`Image`}
                    />
                  </Box>
                </Card>
              </Grid>
            ) : null
          ))}
        </Grid>
      ) : (
        <Typography>No forums found</Typography>
      )}
    </Box>
  )
}

export default BulletinBoard
