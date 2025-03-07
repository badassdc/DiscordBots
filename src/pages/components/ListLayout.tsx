import { alpha, InputBase, Collapse, Toolbar, Fab, Tabs, Tab, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import React, { useState } from "react";

import Layout from "./Layout";

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const CollapseFab = styled(Fab)<{shown: boolean}>(({ shown, theme }) => ({
  ...(shown && {
    boxShadow: 'none'
  }),
  margin: '15px', 
  backgroundColor: '#7289DA', 
  position: 'absolute', 
  top: '65px',
  opacity: 0.3,
  transition: 'all 0.5s ease-out',
  '&:hover': {
    backgroundColor: '#7289DA',
    opacity: 0.7,
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  '&.Mui-selected': {
    color: '#adb6ff',
  },
    transition: 'all 0.5s'
}));

export default function ListLayout(props: { children: JSX.Element, onSearch?: (query: string)=>void, onTapChanged?: (value: any) => void}) {
  const [shown, setShown] = useState(true);
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);

  const handleCollapse = async (event: React.MouseEvent) => {
    setShown(prevState => !prevState);
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSubmit = async (event: React.KeyboardEvent) => {
    if(event.code === "Enter") {
      if(!query) return;
      setIndex(2);
      if(props.onTapChanged) props.onTapChanged(2);
      if(props.onSearch) props.onSearch(query);
    }
  }

  const handleTapChanged = (event: React.SyntheticEvent, value: any) => {
    setIndex(value);
    if(props.onTapChanged) props.onTapChanged(value);
  }

  return (
    <Layout header={
      <Box>
        <Collapse in={shown} sx={{backgroundColor: '#7289DA',}}>
          <Toolbar sx={{ml: '20px'}}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
                value={query} 
                onChange={handleChange} 
                onKeyDown={handleSubmit}
              />
            </Search>
            <Tabs value={index} onChange={handleTapChanged}>
              <StyledTab label="추천" />
              <StyledTab label="최신" />
              <StyledTab label="검색" />
            </Tabs>
          </Toolbar>
        </Collapse>

        <CollapseFab size='medium' shown={shown} onClick={handleCollapse} >
          {shown ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </CollapseFab>
      </Box>
    }>
      {props.children}
    </Layout>
  )
}