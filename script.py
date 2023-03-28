import gspread
import os
from home.models import MainCategories

sa = gspread.service_account(filename="config/gspread/service_account.json")
sh = sa.open("cinqual")

wks = sh.worksheet("Sheet1")
# print('Rows: ', wks.row_count)
# print('Cols: ', wks.col_count)

# print(wks.get('A2:Y5193'))
# print(wks.get_all_records())
main_category = []
records = wks.get_all_records()
for record in records:
    if not record["Main_Category"] in main_category:
        main_category.append(record["Main_Category"])
print(main_category)
for item in main_category:
    category = MainCategories(
        name=item
    )
    category.save()
