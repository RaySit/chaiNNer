import { useCallback, useMemo } from 'react';
import { useContext, useContextSelector } from 'use-context-selector';
import { NodeData } from '../../common/common-types';
import { GlobalContext, GlobalVolatileContext } from '../contexts/GlobalNodeState';
import { DisabledStatus, getDisabledStatus } from '../helpers/disabled';

export interface UseDisabled {
    readonly canDisable: boolean;
    readonly isDirectlyDisabled: boolean;
    readonly status: DisabledStatus;
    readonly toggleDirectlyDisabled: () => void;
}

export const useDisabled = (data: NodeData): UseDisabled => {
    const { id, isDisabled, schemaId } = data;

    const effectivelyDisabledNodes = useContextSelector(
        GlobalVolatileContext,
        (c) => c.effectivelyDisabledNodes
    );
    const { schemata, setNodeDisabled } = useContext(GlobalContext);

    const schema = schemata.get(schemaId);

    const value: UseDisabled = {
        canDisable: schema.hasSideEffects || schema.outputs.length > 0,
        isDirectlyDisabled: isDisabled ?? false,
        status: getDisabledStatus(data, effectivelyDisabledNodes),
        toggleDirectlyDisabled: useCallback(
            () => setNodeDisabled(id, !isDisabled),
            [setNodeDisabled, id, isDisabled]
        ),
    };

    return useMemo(() => value, Object.values(value));
};