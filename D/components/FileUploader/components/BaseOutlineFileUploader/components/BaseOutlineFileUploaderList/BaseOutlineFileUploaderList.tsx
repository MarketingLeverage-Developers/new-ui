import React from 'react';
import BaseStackedFileUploaderList, {
    type BaseStackedFileUploaderListProps,
} from '../../../BaseStackedFileUploader/components/BaseStackedFileUploaderList/BaseStackedFileUploaderList';

export type BaseOutlineFileUploaderListProps = BaseStackedFileUploaderListProps;

const BaseOutlineFileUploaderList: React.FC<BaseOutlineFileUploaderListProps> = (props) => <BaseStackedFileUploaderList {...props} />;

export default BaseOutlineFileUploaderList;
