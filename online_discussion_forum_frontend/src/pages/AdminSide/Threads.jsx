import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from "react-router-dom";
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { Box, Button, Card, CardContent, Grid, Typography, Stack, CardMedia } from '@mui/material';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CommentIcon from '@mui/icons-material/Comment';
import CreateThreads from '../../modals/CreateThreads';

const Threads = () => {
  const [threads, setThreads] = useState([]);
  const [sortOrder, setSortOrder] = useState('newToOld'); // State for sorting order
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const { forumId } = useParams();

  const handleThreadClick = (threadId) => {
    (async () => {
      try {
        await axiosPrivate.patch(`/forums/${forumId}/threads/${threadId}/checkView`);
      } catch (error) {
        console.error(error);
      }
    })();
    navigate(`/admin/${forumId}/${threadId}/`);
  }

  const handleVote = async (id, vote) => {
    try {
      await axiosPrivate.patch(`/forums/${forumId}/threads/${id}/vote`, { vote: vote }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
    } catch (err) {
      console.error(err);
    }
  }

  const fetchThreads = async () => {
    try {
      const response = await axiosPrivate.get(`/forums/${forumId}/threads`);
      const threadData = response.data.thread.map(thread => ({
        userId: thread.user,
        username: thread.username,
        forumPost: thread.forumPost,
        title: thread.title,
        content: thread.content,
        image: thread.image,
        upvotes: thread.upvotes,
        downvotes: thread.downvotes,
        viewCount: thread.viewCount,
        commentCount: thread.commentCount,
        edited: thread.edited,
        pinned: thread.pinned,
        timestamp: new Date(thread.timestamp).toLocaleString(),
        _id: thread._id,
      }));

      // Sort threads based on the sortOrder state
      const sortedThreads = threadData.sort((a, b) => {
        return sortOrder === 'newToOld'
          ? new Date(b.timestamp) - new Date(a.timestamp)
          : new Date(a.timestamp) - new Date(b.timestamp);
      });

      setThreads(sortedThreads);
    } catch (error) {
      console.error(error);
      navigate('/admin/login', { state: { from: location }, replace: true });
    }
  };

  console.log(threads)

  useEffect(() => {
    fetchThreads();
  }, [axiosPrivate, forumId, navigate, location, sortOrder]);

  const handleSortChange = (order) => {
    setSortOrder(order);
  };

  return (
    <Box display={'flex'} flexDirection={'column'}>
      <Stack direction={'row'} justifyContent={'space-between'} sx={{ marginBottom: '20px' }}>
        <Typography variant="h5" sx={{ fontWeight: '700', fontSize: '30px' }}>
          Threads List
        </Typography>
        <Stack direction={'row'} spacing={2}>
          <CreateThreads />
        </Stack>
      </Stack>
      <Stack direction={'row'} spacing={2} marginBottom={'20px'}>
        <Button onClick={() => handleSortChange('newToOld')} variant={sortOrder === 'newToOld' ? 'contained' : 'outlined'}>
          New to Old
        </Button>
        <Button onClick={() => handleSortChange('oldToNew')} variant={sortOrder === 'oldToNew' ? 'contained' : 'outlined'}>
          Old to New
        </Button>
      </Stack>

      {threads.length ? (
        <Grid container spacing={2} direction={'column'} width={'70dvw'}>
          {threads.map((thread) => (
            <Grid item key={thread._id} xs={12} sm={6} md={4} lg={3}>
              <Card sx={{ border: '1px solid #ccc', borderRadius: '8px', height: '200px', }}>
                <Stack height={'100%'} direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                  <CardContent sx={{ width: '45dvw' }} onClick={() => handleThreadClick(thread._id)} style={{ cursor: 'pointer' }}>
                    <Stack direction={'row'} spacing={2}>
                      <Typography onClick={(e) => e.stopPropagation()}>{thread.username}</Typography> {/* Prevent navigation */}
                      <Typography>{thread.timestamp}</Typography>
                      <Typography>{thread.edited ? 'edited' : ''}</Typography>
                    </Stack>
                    <Typography variant="h6" sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: '2',
                      WebkitBoxOrient: 'vertical',
                    }}>{thread.title}</Typography>
                    <Typography sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: '2',
                      WebkitBoxOrient: 'vertical',
                      fontFamily: 'Roboto',
                      whiteSpace: 'pre-wrap', // Preserve whitespace and line breaks
                      margin: 0, // Ensure no extra margin
                    }}>
                      {thread.content}
                    </Typography>
                    <Stack direction={'row'} spacing={2}>
                      <Button onClick={(e) => {
                        e.stopPropagation();
                        handleVote(thread._id, 'upvote');
                      }} startIcon={<ThumbUpOffAltIcon />} sx={{
                        color: '#000000',
                        '&:hover': {
                          bgcolor: 'transparent',
                          color: '#1976d2'
                        }
                      }}><Typography>{thread.upvotes}</Typography></Button>
                      <Button onClick={(e) => {
                        e.stopPropagation();
                        handleVote(thread._id, 'downvote');
                      }} startIcon={<ThumbDownOffAltIcon />} sx={{
                        color: '#b01527',
                        '&:hover': {
                          bgcolor: 'b01527',
                          color: '#b01527'
                        }
                      }}><Typography>{thread.downvotes}</Typography></Button> {/* Prevent navigation */}
                      <Button startIcon={<CommentIcon />}><Typography>{thread.commentCount}</Typography></Button>
                      <Button startIcon={<VisibilityIcon />}><Typography>{thread.viewCount}</Typography></Button>
                    </Stack>
                  </CardContent>
                  <CardMedia
                    component="img"
                    style={{ borderRadius: '30px', height: '150px', width: '250px', objectFit: 'none', marginRight: '20px' }}
                    image={thread.image && thread.image[0] ? `https://dycihub-api.vercel.app/images/${thread.image[0]}` : 'https://fakeimg.pl/200x100/?retina=1&text=こんにちは&font=noto'}
                  />
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography>No threads found</Typography>
      )}
    </Box>
  );
}

export default Threads;
