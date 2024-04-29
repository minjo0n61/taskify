import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import theme from '@/styles/theme';

interface AvatarProps {
  max: number;
  dataArr: AvatarData[];
}

interface AvatarData {
  nickname: string;
  profileImageUrl: string;
  id: number;
}

function AvatarList({ max, dataArr }: AvatarProps) {
  return (
    <AvatarGroup max={max}>
      {dataArr?.map(({ nickname, profileImageUrl, id }) => {
        return (
          <Avatar
            key={id + Math.random()}
            alt={nickname}
            sx={{ bgcolor: theme.color.lightPink }}
            src={profileImageUrl}
          />
        );
      })}
    </AvatarGroup>
  );
}

export default AvatarList;
