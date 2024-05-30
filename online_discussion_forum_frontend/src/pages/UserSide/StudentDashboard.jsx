import { Box, Button, Card, CardContent, CardMedia, Divider, Grid, Paper, Stack, Typography } from '@mui/material'
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CommentIcon from '@mui/icons-material/Comment';
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom/dist/umd/react-router-dom.development';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const StudentDashboard = () => {
    const [topThreads, setTopThreads] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();

    const handleThreadClick = (forumId, threadId) => {
        (async () => {
          try {
            await axiosPrivate.patch(`/forums/${forumId}/threads/${threadId}/checkView`);
    
          } catch (error) {
            if (error.response) {
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
            } else if (error.request) {
              console.log(error.request);
            } else {
              console.log('Error', error.message);
            }
            console.log(error.config);
          }
        })();
    
        navigate(`/client/student/${forumId}/${threadId}/`);
      }
    
      const handleVote = async (forumId, threadId, vote) => {
        try {
          await axiosPrivate.patch(`/forums/${forumId}/threads/${threadId}/vote`, { vote: vote }, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
          });
        } catch (err) {
          console.log(err);
        }
      }
    
      useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getTopTenThreads = async () => {
          try {
            const response = await axiosPrivate.get(`/forums/6643282dfa6095864f20fa43/threads/`, {
              signal: controller.signal
            });
    
            const recentAnnouncements = response.data;
    
            console.log(recentAnnouncements)
    
            if (recentAnnouncements && recentAnnouncements.thread.length > 0) {
              const threadsToDisplay = recentAnnouncements.thread.length >= 3 ? recentAnnouncements.thread.slice(0, 3) : recentAnnouncements;
    
              console.log(threadsToDisplay);
    
              if (isMounted) {
                setTopThreads(threadsToDisplay);
              }
            }
          }
          catch (error) {
            console.log(error);
            navigate('/admin/login', { state: { from: location }, replace: true });
          }
        }
    
        getTopTenThreads();
    
        return () => {
          isMounted = false;
        };
      }, [])

      console.log(topThreads)

    return (
        <Box width={'55dvw'}>
          <Stack direction={'row'} justifyContent={'flex-start'} sx={{
            marginRight: '50px',
            marginBottom: '20px'
          }}>
            <Typography variant="h5" sx={{
              fontWeight: '700',
              fontSize: '20px',
              marginTop: '20px'
            }}>Recent Announcements</Typography>
          </Stack>
          {topThreads?.length ? (
            <Grid container spacing={2} direction={'column'}>
              {topThreads.map((topThread) => {
                return (
                  <Grid item key={topThread._id} xs={12} sm={6} md={4} lg={3}>
                    <Card sx={{ border: '1px solid #ccc', borderRadius: '8px', height: '200px', }}>
                      <Stack height={'100%'} direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                        <CardContent sx={{ width: '45dvw' }} onClick={() => handleThreadClick(topThread.forumPost, topThread._id)} style={{ cursor: 'pointer' }}>
                          <Stack direction={'row'} spacing={2}>
                            <Typography onClick={(e) => e.stopPropagation()}>{topThread.username}</Typography>
                            <Typography>{topThread.timestamp}</Typography>
                            <Typography>{topThread.edited === true ? 'edited' : ''}</Typography>
                          </Stack>
                          <Typography fontSize={'17px'} variant="h6" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical' }}>{topThread.title}</Typography>
                          <Typography
                            fontSize={'14px'}
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: '2',
                              WebkitBoxOrient: 'vertical',
                              fontFamily: 'Roboto',
                              whiteSpace: 'pre-wrap', // Preserve whitespace and line breaks
                              margin: 0, // Ensure no extra margin
                              marginBottom: '10px'
                            }}
                          >
                            {topThread.content}
                          </Typography>
                          <Stack direction={'row'} spacing={2}>
                            <Button onClick={(e) => { e.stopPropagation(); handleVote(topThread.forumPost, topThread._id, 'upvote'); }} startIcon={<ThumbUpOffAltIcon />} sx={{ color: '#000000', '&:hover': { bgcolor: 'transparent', color: '#1976d2' } }}><Typography>{topThread.upvotes}</Typography></Button>
                            <Button onClick={(e) => { e.stopPropagation(); handleVote(topThread.forumPost, topThread._id, 'downvote'); }} startIcon={<ThumbDownOffAltIcon />} sx={{
                              color: '#b01527',
                              '&:hover': {
                                  bgcolor: 'b01527',
                                  color: '#b01527'
                              }
                            }}><Typography>{topThread.downvotes}</Typography></Button>
                            <Button startIcon={<CommentIcon />}><Typography>{topThread.commentCount}</Typography></Button>
                            <Button startIcon={<VisibilityIcon />}><Typography>{topThread.viewCount}</Typography></Button>
                          </Stack>
                        </CardContent>
                        <CardMedia
                          component="img"
                          style={{ borderRadius: '30px', height: '150px', width: '150px', objectFit: 'none', marginRight: '20px' }}
                          image={topThread.image && topThread.image[0] ? `https://dycihub-api.vercel.app/images/${topThread.image[0]}` : 'https://fakeimg.pl/200x100/?retina=1&text=こんにちは&font=noto'}
                        />
                      </Stack>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          ) : null}
        </Box>
      )
}

export default StudentDashboard
