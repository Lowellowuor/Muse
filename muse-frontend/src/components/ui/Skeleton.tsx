export const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-white/10 rounded ${className}`} />
);

// Use in pages
{loading ? (
  <div className="grid grid-cols-3 gap-4">
    {[1,2,3].map(i => <Skeleton key={i} className="h-48" />)}
  </div>
) : (
  rooms.map(room => <RoomCard key={room.id} room={room} />)
)}