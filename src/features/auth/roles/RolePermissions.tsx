import {
  Card,
  Col,
  Collapse,
  CollapseProps,
  FormInstance,
  Row,
  Switch,
} from "antd";
import { useEffect, useState } from "react";
import { IPermission, IRole } from "../../../interfaces";
import { colorMethod, groupBy } from "../../../utils";

interface RolePermissionsProps {
  form: FormInstance<IRole>;
  roleToUpdate?: IRole;
  permissions: IPermission[];
  viewOnly: boolean;
}

const RolePermissions: React.FC<RolePermissionsProps> = ({
  form,
  roleToUpdate,
  permissions,
  viewOnly,
}) => {
  const allRolePermissions = groupBy<IPermission, string>(
    permissions,
    (permissions) => permissions.module,
  );

  const [selectedPermissions, setSelectedPermissions] = useState<
    Map<string, Set<number>>
  >(() => new Map<string, Set<number>>());

  //set form value when selectedPermissions change
  useEffect(() => {
    form.setFieldsValue({
      permissions: Array.from(selectedPermissions.values()).flatMap((ids) =>
        Array.from(ids).map((id) => ({ permissionId: id })),
      ),
    });
  }, [selectedPermissions, form]);

  //set selectedPermissions when there is a roleToUpdate
  useEffect(() => {
    if (roleToUpdate) {
      setSelectedPermissions((prev) => {
        const rolePermissions = groupBy<IPermission, string>(
          roleToUpdate.permissions,
          (permission) => permission.module,
        );
        const newSelectedPermissions = new Map<string, Set<number>>(prev);
        rolePermissions.forEach((permissions, module) => {
          newSelectedPermissions.set(
            module,
            new Set(permissions.map((permission) => permission.permissionId)),
          );
        });
        return newSelectedPermissions;
      });
    }
  }, [roleToUpdate]);

  function isModuleChecked(module: string): boolean {
    const selectedPermissionIds = selectedPermissions.get(module) || new Set();
    const allRolePermissionsLength =
      allRolePermissions.get(module)?.length || 0;
    return (
      selectedPermissionIds.size > 0 &&
      allRolePermissionsLength > 0 &&
      selectedPermissionIds.size === allRolePermissionsLength
    );
  }

  function handlePermissionCheck(
    checked: boolean,
    permission: IPermission,
  ): void {
    if (checked) {
      //add permission id to the module
      setSelectedPermissions((prev) => {
        const newSelectedPermissions = new Map(prev);
        const selectedPermissionIds = newSelectedPermissions.get(
          permission.module,
        );
        if (selectedPermissionIds) {
          selectedPermissionIds.add(permission.permissionId);
          newSelectedPermissions.set(permission.module, selectedPermissionIds);
        } else {
          newSelectedPermissions.set(
            permission.module,
            new Set([permission.permissionId]),
          );
        }
        return newSelectedPermissions;
      });
    } else {
      //remove permission id from the module
      setSelectedPermissions((prev) => {
        const newSelectedPermissions = new Map(prev);
        const selectedPermissionIds = newSelectedPermissions.get(
          permission.module,
        );
        if (selectedPermissionIds) {
          selectedPermissionIds.delete(permission.permissionId);
          newSelectedPermissions.set(permission.module, selectedPermissionIds);
        }
        return newSelectedPermissions;
      });
    }
  }

  function handleModuleCheck(checked: boolean, module: string): void {
    if (checked) {
      setSelectedPermissions((prev) => {
        const newSelectedPermissions = new Map(prev);
        newSelectedPermissions.set(
          module,
          new Set(
            allRolePermissions
              .get(module)
              ?.map((p: IPermission) => p.permissionId),
          ),
        );

        return newSelectedPermissions;
      });
    } else {
      setSelectedPermissions((prev) => {
        const newSelectedPermissions = new Map(prev);
        newSelectedPermissions.delete(module);
        return newSelectedPermissions;
      });
    }
  }

  const items: CollapseProps["items"] = Array.from(
    allRolePermissions.keys(),
  ).map((module: string) => ({
    key: module,
    label: <div>{module}</div>,
    forceRender: true,
    extra: (
      <Switch
        disabled={viewOnly}
        checked={isModuleChecked(module)}
        onClick={(_, event) => event.stopPropagation()}
        onChange={(checked) => handleModuleCheck(checked, module)}
      />
    ),
    children: (
      <Row gutter={[16, 16]}>
        {allRolePermissions
          .get(module)
          ?.map((permission: IPermission, index: number) => (
            <Col key={`${index}-child-${permission.module}`} span={12}>
              <Card size="small">
                <div className="flex flex-1">
                  <div className="flex flex-col items-center">
                    <Switch
                      disabled={viewOnly}
                      checked={selectedPermissions
                        .get(module)
                        ?.has(permission.permissionId)}
                      className="mt-[3px]"
                      onChange={(checked) =>
                        handlePermissionCheck(checked, permission)
                      }
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <p className="mb-[3px] pl-[10px]">
                      {permission?.name || ""}
                    </p>
                    <div className="flex flex-1">
                      <p
                        className="pl-[10px] font-bold"
                        style={{ color: colorMethod(permission?.method) }}
                      >
                        {permission?.method || ""}
                      </p>
                      <p className="flex-1 pl-[10px]">
                        {permission?.apiPath || ""}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
      </Row>
    ),
  }));

  return <Collapse items={items} />;
};

export default RolePermissions;
