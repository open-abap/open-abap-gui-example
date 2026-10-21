REPORT zgui_example.

* Simple dynpro example: screen 0100 shows a few basic input fields,
* Save echoes the entered values in a message, Back/Exit/Cancel leave.

DATA gv_ok_code TYPE sy-ucomm.
DATA gv_name TYPE c LENGTH 30.
DATA gv_city TYPE c LENGTH 25.
DATA gv_quantity TYPE i.
DATA gv_active TYPE abap_bool.

START-OF-SELECTION.
  gv_quantity = 1.
  gv_active = abap_true.
  CALL SCREEN 100.

MODULE status_0100 OUTPUT.
  SET PF-STATUS 'MAIN'.
  SET TITLEBAR 'MAIN'.
ENDMODULE.

MODULE exit_command_0100 INPUT.
  LEAVE TO SCREEN 0.
ENDMODULE.

MODULE user_command_0100 INPUT.
  CASE gv_ok_code.
    WHEN 'BACK'.
      CLEAR gv_ok_code.
      LEAVE TO SCREEN 0.
    WHEN 'SAVE'.
      CLEAR gv_ok_code.
      IF gv_name IS INITIAL.
        MESSAGE 'Enter a name' TYPE 'S' DISPLAY LIKE 'E'.
      ELSE.
        MESSAGE |Saved { gv_name }, { gv_city }, quantity { gv_quantity }| TYPE 'S'.
      ENDIF.
  ENDCASE.
ENDMODULE.
