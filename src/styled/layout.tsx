import styled from 'styled-components';

export const size = {
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

export const mediaDiv = styled.div`
margin: auto;

@media ${device.mobileS} {
  max-width: 300px;
}

@media ${device.mobileL} {
  max-width: 400px;
}

@media ${device.tablet} {
  max-width: 600px;
}

@media ${device.desktop} {
  max-width: 1400px;
}
`;

export const LayoutDiv = styled.div`
display: flex;
flex-direction: column;
height: 100%;
`;

export const HeaderDiv = styled(mediaDiv)`
width: 100%;
display: flex;
justify-content: space-between;
align-items: flex-end;
font-size: 1.4rem;
margin: 8px auto;
`;

export const ContentDiv = styled(mediaDiv)`
width: 100%;
flex: 1 1 auto;
padding: 2rem 0px;
`;

export const FooterDiv = styled(HeaderDiv)`
flex-direction: column;
justify-content: center;
align-items: center;
font-size: 0.8rem;
line-height: 1.4rem;
`;

export const NavDiv = styled.div`
font-size: 0.8rem;
& > a {
  margin: 0px 12px;
}
`;