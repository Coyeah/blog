import styled from 'styled-components';

const size = {
  mobileS: '320px',
  mobileM: '375px',
  mobileL: '425px',
  tablet: '768px',
  laptop: '1024px',
  laptopL: '1440px',
  desktop: '2560px'
}

export const device = {
  mobileS: `(min-width: ${size.mobileS})`,
  mobileM: `(min-width: ${size.mobileM})`,
  mobileL: `(min-width: ${size.mobileL})`,
  tablet: `(min-width: ${size.tablet})`,
  laptop: `(min-width: ${size.laptop})`,
  laptopL: `(min-width: ${size.laptopL})`,
  desktop: `(min-width: ${size.desktop})`,
  desktopL: `(min-width: ${size.desktop})`
};

export const LayoutDiv = styled.div`
  display: flex;
  flex-direction: column;
  margin: auto;
  height: 100%;

  @media ${device.mobileS} {
    max-width: 300px;
  }

  @media ${device.tablet} {
    max-width: 700px;
  }

  @media ${device.desktop} {
    max-width: 1400px;
  }
`;

export const HeaderDiv = styled.div`
  width: 100%;
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  font-size: 1.4rem;
  margin-bottom: 20px;
`;

export const ContentDiv = styled.main`
  width: 100%;
  flex: 1 1 auto;
`;

export const FooterDiv = styled(HeaderDiv)`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 0.8rem;
  line-height: 1.2rem;
  margin-bottom: 0px;
`;

export const NavDiv = styled.div`
  font-size: 0.6rem;
  & > a {
    margin: 0px 8px;
  }
`;