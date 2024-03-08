import React from 'react';
import { render, screen, fireEvent} from '@testing-library/react';
import Post from '../FeedPage/Post';

describe('Post component', () => {
  const mockPost = {
    authorImageSrc: './Les-Looney-Tunes.jpg',
    authorName: 'Shelly Shir',
    timeStamp: '2024-02-15',
    postBody: 'This is a test post body.',
    postImageSrc: 'flowers.jpg',
    label: 'Test Label',
    postTitle: 'Test Title',
    postDescription: 'Test Description',
    emojisCount: 3,
    commentsCount: 5,
    sharesCount: 2,
    isLiked: true,
    isCommented: false,
    onLike: jest.fn(),
    comments: ['Comment 1', 'Comment 2'],
    onComment: jest.fn(),
    onShare: jest.fn(),
  };

  it('renders post details correctly', () => {
    render(<Post {...mockPost} />);

    // Check if author details are rendered
    expect(screen.getByText('Shelly Shir')).toBeInTheDocument();
    expect(screen.getByText('2024-02-15')).toBeInTheDocument();
    
    // Check if post body and image are rendered
    expect(screen.getByText('This is a test post body.')).toBeInTheDocument();
    expect(screen.getByAltText('Post')).toBeInTheDocument();
    
    // Check if reactions count is rendered
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('displays relevant comments when isCommented is true', () => {
    const { getByText, queryByText } = render(<Post {...mockPost} isCommented={true} />);

    // Check if "displaying only relevant comments" text is rendered
    expect(getByText('displaying only relevant comments')).toBeInTheDocument();
    
    // Check if all comments are rendered
    expect(getByText('Comment 1')).toBeInTheDocument();
    expect(getByText('Comment 2')).toBeInTheDocument();
    
    // Ensure other comments are not rendered
    expect(queryByText('Comment 3')).toBeNull();
  });

  it('calls the onLike, onComment, and onShare functions correctly', () => {
    render(<Post {...mockPost} />);
    
    // // Check if onLike function is called
    // expect(mockPost.onLike).toHaveBeenCalled();
    
    // Click on the comment button
    fireEvent.click(screen.getByText('Comment'));
    
    // Check if onComment function is not called because no comment is provided
    expect(mockPost.onComment).not.toHaveBeenCalled();
    
    // Type a comment and click on the post button
    fireEvent.change(screen.getByPlaceholderText('Add a comment...'), { target: { value: 'Test comment' } });
    fireEvent.click(screen.getByText('Post'));
    
    // Check if onComment function is called with the correct comment
    expect(mockPost.onComment).toHaveBeenCalledWith('Test comment');
    
    // Click on the share button
    fireEvent.click(screen.getByText('Share'));
    
    // Check if onShare function is called
    expect(mockPost.onShare).toHaveBeenCalled();
  });
  
  

});