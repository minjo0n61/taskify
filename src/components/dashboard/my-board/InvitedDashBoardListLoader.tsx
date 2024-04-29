import InvitedDashBoardSkeleton from '@/components/dashboard/my-board/InvitedDashBoardSkeleton';

function InvitedDashBoardListLoader({ loaderRef, ...props }) {
  return (
    <div ref={loaderRef} {...props}>
      {Array.from({ length: 5 }).map((_, index) => (
        <InvitedDashBoardSkeleton key={index} />
      ))}
    </div>
  );
}

export default InvitedDashBoardListLoader;
