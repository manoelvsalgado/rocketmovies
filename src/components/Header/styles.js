import styled from "styled-components";
import { Link } from 'react-router-dom';

export const Container = styled.header`
  grid-area: header;

  height: 105px;
  width: 100%;

  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: ${({ theme }) => theme.COLORS.BACKGROUND_700};

  display: flex;
  align-items: center;
  gap: 24px;

  padding: 0 80px;

  h1 {
    color: ${({ theme }) => theme.COLORS.PINK};
    font-family: 'Roboto Slab';
    font-weight: 700;
    font-size: 24px;
  }

  > .search {
    flex: 1;
    max-width: 630px;
  }

  .admin-btn {
    background: none;
    border: none;
    color: ${({ theme }) => theme.COLORS.PINK};
    cursor: pointer;
    font-size: 24px;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: all 0.2s;

    svg {
      width: 24px;
      height: 24px;
    }

    &:hover {
      background-color: rgba(255, 133, 155, 0.1);
    }
  }
`;

export const Profile = styled(Link)`
display: flex;
align-items: center;

 > img {
  width: 64px;
  height: 64px;
  border-radius: 50%;
 }

 > div {
  width: 198px;
  height: 68px;
  display: flex;
  flex-direction: column;
  margin-left: 16px;
  line-height: 24px;

  strong {
    color: ${({ theme }) => theme.COLORS.WHITE};
    font-family: 'Roboto Slab';
    font-weight: 700;
    font-size: 14px;
  }

  span {
    color: ${({ theme }) => theme.COLORS.GRAY_100};
    font-size: 14px;
  }
 }
`;

export const Logout = styled.button`
  border: none;
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    color:${({ theme }) => theme.COLORS.GRAY_100};
    font-size: 24px;
  }
`;