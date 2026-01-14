import BaseChip from '@/shared/primitives/BaseChip/BaseChip';
import Text from '@/shared/primitives/Text/Text';
import type { HexColor } from '@/shared/types/css/HexColor';
import type { ThemeColorVar } from '@/shared/types/css/ThemeColorTokens';
import type { EventContentArg } from '@fullcalendar/core/index.js';

type CalendarEventItemProps = {
    arg?: EventContentArg;
};

export const CalendarEventItem = ({ arg }: CalendarEventItemProps) => {
    const { badge = '', color } = arg?.event.extendedProps as {
        badge?: string;
        color?: HexColor | ThemeColorVar;
    };
    const isMonth = arg?.view.type === 'dayGridMonth';
    const isAllDay = arg?.event.allDay === true;

    return (
        <div className="ml-event">
            {isMonth && !isAllDay && <span className="fc-daygrid-event-dot" />}
            <Text className="time">{arg?.timeText}</Text>
            {badge && (
                <BaseChip
                    style={{
                        whiteSpace: 'nowrap',
                        height: '17px',
                        boxSizing: 'border-box',
                    }}
                    width={'fit-content'}
                    className="chip"
                    radius={3}
                    padding={{ x: 4, y: 2 }}
                    bgColor={color}
                >
                    {badge}
                </BaseChip>
            )}
            <Text className="title">{arg?.event.title}</Text>
        </div>
    );
};

export default CalendarEventItem;
