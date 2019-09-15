import Link from 'next/link';

const OwnLink = ({text, ...restProps}) => (
  <Link {...restProps}>
    <a>{text}</a>
  </Link>
)

export default OwnLink;