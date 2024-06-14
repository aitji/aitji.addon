import os
import shutil
import zipfile
from colorama import Fore, Style

def zip_folder(folder_path, zip_file_name):
    with zipfile.ZipFile(zip_file_name, 'w') as zipf:
        for root, dirs, files in os.walk(folder_path):
            for file in files:
                file_path = os.path.join(root, file)
                relative_path = os.path.relpath(file_path, folder_path)
                zipf.write(file_path, relative_path)

def process_folders(root_folder):
    for folder, subfolders, files in os.walk(root_folder):
        print(f"{Fore.GREEN}Processing: {os.path.basename(folder)}{Style.RESET_ALL}")
        addon_folder = os.path.join(folder, 'addon')
        if os.path.exists(addon_folder):
            addon_files = os.listdir(addon_folder)
            if addon_files:
                print(f"{Fore.YELLOW}Found addon in: {os.path.basename(folder)}{Style.RESET_ALL}")
                temp_folder = os.path.join(folder, '__temp__')
                os.makedirs(temp_folder, exist_ok=True)
                zip_folder(addon_folder, os.path.join(temp_folder, 'Download.mcpack'))
                existing_addon_file = os.path.join(folder, 'Download.mcpack')
                if os.path.exists(existing_addon_file):
                    os.remove(existing_addon_file)
                    print(f"{Fore.RED}Deleted existing Download.mcpack in: {os.path.basename(folder)}{Style.RESET_ALL}")
                shutil.move(os.path.join(temp_folder, 'Download.mcpack'), folder)
                print(f"{Fore.CYAN}Renamed Download.mcpack to Download.mcpack in: {os.path.basename(folder)}{Style.RESET_ALL}")
                shutil.rmtree(temp_folder)
                print(f"{Fore.BLUE}Removed temporary folder in: {os.path.basename(folder)}{Style.RESET_ALL}")

def main():
    root_folder_path = os.getcwd()
    print(f"{Fore.YELLOW}This program will delete existing Download.mcpack files before creating new ones.{Style.RESET_ALL}\nRoot={Fore.LIGHTCYAN_EX}{root_folder_path}\n{Style.RESET_ALL}")
    confirm = input("Do you want to continue? (yes/no): ").strip().lower()
    if confirm not in ['yes', 'y', '1']:
        print(f"{Fore.RED}Operation cancelled.{Style.RESET_ALL}")
        return
    for root, dirs, files in os.walk(root_folder_path):
        for file in files:
            if file == 'Download.mcpack':
                os.remove(os.path.join(root, file))
                print(f"{Fore.RED}Deleted existing {file} in: {os.path.basename(root)}{Style.RESET_ALL}")
    create_new = input("Do you want to create new Download.mcpack? (yes/no): ").strip().lower()
    if create_new in ['yes', 'y', '1']:
        process_folders(root_folder_path)
    else:
        print("No new Download.mcpack will be created.")

os.system('cls' if os.name == 'nt' else 'clear')
if __name__ == "__main__":
    print(f"{Fore.GREEN}Request from: {__name__}{Style.RESET_ALL}\n| it main connection pass!\n\n")
    main()
else:
    print(f"{Fore.RED}Request from: {__name__}{Style.RESET_ALL}\n| isn't main disconnect connection\n* please run this on main file\n\n")
    exit()